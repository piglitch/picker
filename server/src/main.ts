import express, { Request, Response } from "express";

import cors from "cors"
const multer = require("multer")
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import crypto from "crypto";
import { dummyData } from "../dummyData/dummy";
import check from "../sendData/check";
import dotenv from "dotenv";
import { createUser, getAllUsers } from "../db/queries";
import { createClerkClient } from "@clerk/backend";
import { ClerkExpressRequireAuth, RequireAuthProp, StrictAuthProp } from '@clerk/clerk-sdk-node'
// import { clerkClient, requireAuth } from '@clerk/express'

dotenv.config()

const app = express();
declare global {
  namespace Express {
    interface Request extends StrictAuthProp {}
  }
}
app.use(cors());
app.use(express.json()); 
const randomImageId = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

const bucketName = process.env.BUCKET_NAME!;
const bucketRegion = process.env.BUCKET_REGION!;
const accessKey = process.env.ACCESS_KEY!;
const secretKey = process.env.SECRET_KEY!;

let currentUser = null;
// const clerk = new Clerk(process.env.CLERK_PUBLISHABLE_KEY!)
// clerk.load()

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

let users: object[]
const checkIfUserExists = async (currentUser: any) => {
  users = []
  const userList = await getAllUsers()
  for(let i = 0; i < userList?.length!; i++){
    users.push(userList![i])
  }
  console.log(users);
  if(users.includes(currentUser.id)){
    console.log('user exists!', users);
  } else {
    createUser(currentUser)
  }
  console.log(userList?.length);
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


app.get("/", async (req: Request, res) => {
  res.send("Server is up!")
});

app.get("/verify-user", ClerkExpressRequireAuth(), async (req: RequireAuthProp<Request>, res) => {
  const user = await clerkClient.users.getUser(req.auth.userId);
  checkIfUserExists(user);
  console.log(user.id);
  res.redirect("/api/user-apps");
});

app.get("/api/user-apps/", async (req:Request, res: Response) => {
  // const user = await clerkClient.users.getUser(req.auth.userId)
  // checkIfUserExists(user)
  // console.log(user.id);
  res.send(dummyData);
});

app.get("/api/s3-upload", (req: Request, res: Response) => {
  res.send("upload route");
});

app.post("/api/s3-upload/", upload.single("file"), async (req: Request, res: Response) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: randomImageId(),
      Body: req.file?.buffer,
      ContentType: req.file?.mimetype,
    };
    const command = new PutObjectCommand(params);
    await s3.send(command);
    console.log("File name: ", params.Key);
    res.status(200).send({ status: `${req.file?.originalname} is uploaded!` });
  } catch (err) {
    res.status(500).send({ status: err });
  }
});

// app.post("/api/create-user/", (req: Request, res: Response) => {
//   try {
//     res.status(200).send({ 'status': 'Data stored' })
//   } catch (error) {
//     console.log(error);
//   }
// })

app.get("/api/create-user/", (req: Request, res: Response) => {
  console.log(req.originalUrl);
  res.json('route is up');
})

app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000`);
});
