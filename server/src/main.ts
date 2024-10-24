import express, { Request, Response } from "express";

import cors from "cors"
const multer = require("multer")
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import crypto from "crypto";
import { dummyData } from "../dummyData/dummy";
import check from "../sendData/check";
import dotenv from "dotenv";
import { createUser } from "../db/queries";
import { createClerkClient } from "@clerk/backend";
import { ClerkExpressRequireAuth, RequireAuthProp, StrictAuthProp } from '@clerk/clerk-sdk-node'
import { json } from "stream/consumers";
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

// const clerk = new Clerk(process.env.CLERK_PUBLISHABLE_KEY!)
// clerk.load()

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
// const session = clerkClient.sessions.getSession()
let users: string[]
const getAllUsers = async() => {
  
  users = []
  const userList = await clerkClient.users.getUserList()
  for(let i = 0; i < userList.totalCount; i++){
    users.push(userList.data[0].id)
  }
  // console.log(users);
  // if () {
    
  // }
}

console.log(getAllUsers());


const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
  region: bucketRegion,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/", ClerkExpressRequireAuth(), async (req: RequireAuthProp<Request>, res) => {
  // const { userId } = req.auth
  const user = await clerkClient.users.getUser(req.auth.userId)
  console.log(user.id === users[0]);
  res.send(check());
});

app.get("/api/user-apps/", (req: Request, res: Response) => {
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

app.post("/api/create-user/", (req: Request, res: Response) => {
  try {
    createUser()
    res.status(200).send({ 'status': 'Data stored' })
  } catch (error) {
    console.log(error);
  }
})

app.get("/api/create-user/", (req: Request, res: Response) => {
  res.send('route is up')
})

app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000`);
});
