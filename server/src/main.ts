import express, { Request, Response } from "express";

import cors from "cors"
const multer = require("multer")
import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import crypto from "crypto";
import { dummyData } from "../dummyData/dummy";
// import check from "../sendData/check";
import dotenv from "dotenv";
import { addFile, createUser, getAllFilesByUser, getAllUsers } from "../db/queries";
import { createClerkClient } from "@clerk/backend";
import { ClerkExpressRequireAuth, RequireAuthProp, StrictAuthProp } from '@clerk/clerk-sdk-node'
// import { clerkClient, requireAuth } from '@clerk/express'
import redis, { createClient } from "redis";


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
    createUser(currentUser)
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


app.get("/", async (req: Request, res) => {
  res.send("Server is up!")
});

// To verify the current user
app.get("/:id/verify-user", async (req: Request, res) => {
  const userId = req.params.id;
  const userString = await redisClient.get(`user:${userId}`)
  if (!userString) {
    const user = await clerkClient.users.getUser(userId);
    // console.log(userId); 
    await redisClient.set(`user:${userId}`, JSON.stringify(user))
    checkIfUserExists(user)
  } else{
    checkIfUserExists(JSON.parse(userString!));
  }
  //console.log(JSON.parse(userString!).id);  
  res.redirect(`/api/${userId}/user-apps`);
});

app.get("/api/:id/user-apps/", async (req:Request, res: Response) => {
  res.send(dummyData);
});

app.get("/api/s3-upload", (req: Request, res: Response) => {
  res.send("upload route");
});

app.get("/api/:id/all-files", async (req, res) => {
  const userId = req.params.id;
  // const user = await clerkClient.users.getUser(userId);
  const userString = await redisClient.get(`user:${userId}`)
  const files = await getAllFilesByUser(JSON.parse(userString!))
  res.send(files)
})

// Uplaoding files to s3 
app.post("/api/:id/s3-upload/", upload.single("file"), async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const userString = await redisClient.get(`user:${userId}`)
    const user = await JSON.parse(userString!)
    const params = {
      Bucket: bucketName,
      Key: randomImageId(),
      Body: req.file?.buffer,
      ContentType: req.file?.mimetype,
    };
    const userFile = {
      id: params.Key,
      title: req.file?.originalname,
      uploaderId: req.params.id,
      key: params.Key
    }
    const putObjCommand = new PutObjectCommand(params);
    console.log(user?.emailAddresses[0].emailAddress);
    addFile(user?.emailAddresses[0].emailAddress, userFile)
    await s3.send(putObjCommand);
    // console.log("File name: ", params.Key);
    res.status(200).send({ status: `${req.file?.originalname} is uploaded!` });
  } catch (err) {
    res.status(500).send({ status: err });
  }
});



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

app.get("/api/:id/file-details", async (req, res) => {
  const userId = req.params.id;
  const userString = await redisClient.get(`user:${userId}`)
  const usage = await redisClient.get(`userFiles:${userId}`)
  
  // const user = await clerkClient.users.getUser(userId);
  let sum = 0;
  if (usage) {
    sum = JSON.parse(usage);
  } else {
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

app.listen(3000, () => {
  console.log(`Server running at http://13.60.182.170:3000`);
});
