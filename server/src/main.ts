import express, { Request, Response } from "express";

import cors from "cors"
const multer = require("multer")
import { DeleteObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import crypto from "crypto";
// import { dummyData } from "../dummyData/dummy";
// import check from "../sendData/check";
import dotenv from "dotenv";
import { addFile, createUser, deleteFileObj, getAllFilesByUser, getAllUsers, test_connection } from "../db/queries";
import { createClerkClient } from "@clerk/backend";
// import { ClerkExpressRequireAuth, RequireAuthProp, StrictAuthProp } from '@clerk/clerk-sdk-node'
// const { expressWithAuth, requireAuth } = require('@clerk/clerk-sdk-node');
// import { clerkClient, requireAuth } from '@clerk/express'
import { clerkMiddleware, requireAuth } from '@clerk/express'
import redis, { createClient } from "redis";



dotenv.config()

const app = express();
// app.use(clerkMiddleware())

// app.use(expressWithAuth());

// declare global {
//   namespace Express {
//     interface Request extends StrictAuthProp {}
//   }
// }

app.use(cors());
app.use(express.json()); 
const randomImageId = (bytes = 8) => crypto.randomBytes(bytes).toString("hex");

const bucketName = process.env.BUCKET_NAME!;
const bucketRegion = process.env.BUCKET_REGION!;
const accessKey = process.env.ACCESS_KEY!;
const secretKey = process.env.SECRET_KEY!;

// const clerk = new Clerk(process.env.CLERK_PUBLISHABLE_KEY!)
// clerk.load()

const redisClient = createClient();
redisClient.connect();

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

let users: object[]
let updatedUser = {
  id: null, 
  name: null, 
  email: null,
};

const checkIfUserExists = async (currentUser: any) => {
  users = []
  updatedUser = { 
    id: currentUser.id, 
    name: currentUser.fullName, 
    email: currentUser.emailAddresses[0].emailAddress
  };
  const userList = await getAllUsers()
  for(let i = 0; i < userList?.length!; i++){
    users.push(userList![i])
  }
  if(users.includes(currentUser.id)){
    console.log('user exists!', users);
  } else {
    await createUser(currentUser)
  }
}

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
  region: bucketRegion,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.get("/api/", async (req: Request, res) => {
  res.send("Server is up!")
});

// To verify the current user
app.get("/api/:id/verify-user", requireAuth(), async (req: Request, res) => {
  const userId = req.params.id;
  const userString = await redisClient.get(`user:${userId}`)
  if (!userString) {
    const user = await clerkClient.users.getUser(userId);
    // console.log(userId); 
    await redisClient.set(`user:${userId}`, JSON.stringify(user))
    await checkIfUserExists(user)
  } else{
    await checkIfUserExists(JSON.parse(userString!));
  }
  console.log("userString: ", JSON.parse(userString!).firstName);  
  res.send({authenticated: 'yes'})
});


app.get("/api/s3-upload", (req: Request, res: Response) => {
  res.send("upload route");
});

app.get("/api/:id/all-files", requireAuth(), async (req, res) => {
  const userId = req.params.id;
  // const user = await clerkClient.users.getUser(userId);
  const userString = await redisClient.get(`user:${userId}`)
  const files = await getAllFilesByUser(JSON.parse(userString!))
  console.log(files);
  res.send(files)
})

// Uplaoding files to s3 
app.post("/api/:id/s3-upload/", upload.single("file"), requireAuth(), async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;

    // Fetch user from Redis
    const userString = await redisClient.get(`user:${userId}`);
    if (!userString) {
      res.status(404).send({ status: 'User not found in cache' });
      return; // Return to avoid further execution
    }
    const user = JSON.parse(userString);

    // Check if file exists in the request
    if (!req.file) {
      res.status(400).send({ status: 'No file uploaded' });
      return; // Return after sending the response
    }

    // Validate user email
    const emailAddress = user?.emailAddresses?.[0]?.emailAddress;
    if (!emailAddress) {
      res.status(400).send({ status: 'User email not found' });
      return; // Return after sending the response
    }

    // Set up parameters for S3 upload
    const params = {
      Bucket: bucketName,
      Key: randomImageId(),
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const userFile = {
      id: params.Key,
      title: req.file.originalname,
      uploaderId: userId,
      key: params.Key
    };

    // Upload to S3
    const putObjCommand = new PutObjectCommand(params);
    await s3.send(putObjCommand);

    // Add file info to your database or storage system
    await addFile(emailAddress, userFile);

    // Respond with success message
    res.status(200).send({ status: `${req.file.originalname} is uploaded!` });
  } catch (err) {
    // Log and handle error properly
    console.error("Upload error:", err);
    res.status(500).send({ status: err instanceof Error ? err.message : 'Unknown error' });
  }
});


app.delete("/api/:id/delete-object/:fileKey", requireAuth(), async (req, res) => {
  try {
    const userId = req.params.id;
    const userString = await redisClient.get(`user:${userId}`)
    const user = JSON.parse(userString!);
    const emailAddress = user?.emailAddresses?.[0]?.emailAddress;

    if (!emailAddress) {
      res.status(400).send({ status: 'User email not found' });
      return; // Return after sending the response
    }

  const fileKey = req.params.fileKey;
    const bucketParams = { Bucket: bucketName, Key: fileKey };
    const deleteFile = new DeleteObjectCommand(bucketParams);
    await s3.send(deleteFile);
    await deleteFileObj(emailAddress, fileKey)
    res.status(200).send({ status: 'file is deleted' });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).send({ status: error instanceof Error ? error.message : 'Unknown error' });
  }
} )


async function getFileDetails(bucketName: string, key: string) {
  try {
    // Set the parameters for the command
    const params = {
      Bucket: bucketName,
      Key: key,
    };

    // Execute the headObject command
    const command = new HeadObjectCommand(params);
    const data = await s3.send(command);

    // Print out the file details
    //console.log("File Details:", data);
    return data;
  } catch (error) {
    console.error("Error fetching file details:", error);
  }
}

app.get("/api/:id/file-details", requireAuth(), async (req, res) => {
  const userId = req.params.id;
  const userString = await redisClient.get(`user:${userId}`)
  const usage = await redisClient.get(`userFiles:${userId}`)
  
  // const user = await clerkClient.users.getUser(userId);
  let sum = 0;
  if (usage) {
    console.log('redis hit');
    sum = JSON.parse(usage);
  } else {
    console.log('no hit redis');
    const files = await getAllFilesByUser(JSON.parse(userString!))
    const allFilesDetails = await Promise.all(
      (files || []).map(file => getFileDetails(bucketName, file.key))
    );
    const resFilesDetails = allFilesDetails?.map(file => file?.ContentLength);
    resFilesDetails.forEach(num => { 
     if (num) {
      sum += num
     }
    })
    await redisClient.set(`userFiles:${userId}`, JSON.stringify(sum))
  }
  res.send({appSize: sum})
})

// app.get("/api/:id/test-conn", requireAuth(), async (req, res) => {
//   const userList = test_connection()
//   res.send({status: "ok", users: userList})
// })

app.get('/api/protected', requireAuth(), (req, res) => {
  res.send('This is a protected route')
})

const port = 3000
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
