import express, { Request, Response } from "express";
import cors from "cors";
const multer = require("multer");
import { DeleteObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import crypto from "crypto";
import dotenv from "dotenv";
import { addFile, createUser, deleteFileObj, getAllFilesByUser } from "../db/queries";
import { clerkMiddleware, createClerkClient, getAuth } from "@clerk/express";
import redisClient from "./utils/redisClient";
import verifyClerkAuth from "./utils/verifyClerkAuth";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware())

const randomImageId = (bytes = 8) => crypto.randomBytes(bytes).toString("hex");

const bucketName = process.env.BUCKET_NAME!;
const bucketRegion = process.env.BUCKET_REGION!;
const accessKey = process.env.ACCESS_KEY!;
const secretKey = process.env.SECRET_KEY!;

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
  region: bucketRegion,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



app.get("/api/", async (req: Request, res: Response) => {
  console.log('Server is running');
  res.send("Server is up!");
});

// ✅ Verify User Route
app.get("/api/:id/verify-user", verifyClerkAuth, async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    // Check Redis cache
    let userString = await redisClient.get(`user:${userId}`);
    let user;

    if (!userString) {
      user = await clerkClient.users.getUser(userId);
      console.log("Fetching user from Clerk...");
      await createUser(user);
      await redisClient.set(`user:${userId}`, JSON.stringify(user));
    } else {
      user = JSON.parse(userString);
    }

    res.send({ authenticated: "yes" });
  } catch (error) {
    console.error("Error during user verification:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

// ✅ Fetch all files
app.get("/api/:id/all-files", verifyClerkAuth, async (req: Request, res: Response) => {
  const userId = req.params.id;
  const userString = await redisClient.get(`user:${userId}`);
  const userFiles = await redisClient.get(`userFiles:${userId}`);

  if (!userFiles && userString) {
    const files = await getAllFilesByUser(JSON.parse(userString));
    await redisClient.set(`userFiles:${userId}`, JSON.stringify(files));
    console.log("Fetched from DB");
    res.send(files);
    return;
  }

  console.log("Fetched from Redis");
  res.send(userFiles ? JSON.parse(userFiles) : []);
});

// ✅ Uploading files to S3
app.post("/api/:id/s3-upload/", upload.single("file"), verifyClerkAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const userString = await redisClient.get(`user:${userId}`);

    if (!userString) {
      res.status(404).send({ status: "User not found in cache" });
      return;
    }
    const user = JSON.parse(userString);

    if (!req.file) {
      res.status(400).send({ status: "No file uploaded" });
      return;
    }

    const emailAddress = user?.emailAddresses?.[0]?.emailAddress;
    if (!emailAddress) {
      res.status(400).send({ status: "User email not found" });
      return;
    }

    const imageKey = `${userId}/${randomImageId()}`;
    const params = {
      Bucket: bucketName,
      Key: imageKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const userFile = {
      id: params.Key,
      title: req.file.originalname,
      uploaderId: userId,
      key: params.Key,
    };

    await s3.send(new PutObjectCommand(params));
    await addFile(emailAddress, userFile);

    const files = await getAllFilesByUser(JSON.parse(userString));
    await redisClient.set(`userFiles:${userId}`, JSON.stringify(files));

    // Calculate total usage
    let sum = 0;
    const allFilesDetails = await Promise.all(
      (files || []).map((file) => getFileDetails(bucketName, file.key))
    );
    allFilesDetails.forEach((file) => {
      if (file?.ContentLength) sum += file.ContentLength;
    });
    await redisClient.set(`userUsage:${userId}`, sum);

    console.log("Redis updated");
    res.status(200).send({ status: `${req.file.originalname} is uploaded!` });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).send({ status: err instanceof Error ? err.message : "Unknown error" });
  }
});

// ✅ File Details
app.get("/api/:id/file-details", verifyClerkAuth, async (req, res) => {
  const userId = req.params.id;
  const userString = await redisClient.get(`user:${userId}`);
  const usage = await redisClient.get(`userUsage:${userId}`);
  let sum = 0;

  if (usage != null) {
    console.log("Redis hit");
    sum = JSON.parse(usage);
  } else if (userString) {
    console.log("No Redis hit");
    const files = await getAllFilesByUser(JSON.parse(userString));
    const allFilesDetails = await Promise.all(
      (files || []).map((file) => getFileDetails(bucketName, file.key))
    );
    allFilesDetails.forEach((file) => {
      if (file?.ContentLength) sum += file.ContentLength;
    });
    await redisClient.set(`userUsage:${userId}`, sum);
  }

  res.send({ appSize: sum });
});

// ✅ Protected route test
app.get("/api/protected", verifyClerkAuth, (req, res) => {
  res.send("This is a protected route");
});

// ✅ Get file details helper
async function getFileDetails(bucketName: string, key: string) {
  try {
    const params = { Bucket: bucketName, Key: key };
    const command = new HeadObjectCommand(params);
    return await s3.send(command);
  } catch (error) {
    console.error("Error fetching file details:", error);
  }
}

app.get("/", async (req: Request, res) => {
  res.send("Server route");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
