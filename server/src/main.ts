import express, { Request, Response } from "express";
import cron from "node-cron";
import cors from "cors";
const multer = require("multer")
import { DeleteObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import crypto from "crypto";
import dotenv from "dotenv";
import { addFile, createUser, deleteFileObj, getAllFilesByUser, getAllUsers, test_connection } from "../db/queries";
import { createClerkClient } from "@clerk/backend";
import { requireAuth } from '@clerk/express'
import redis, { createClient } from "redis";



dotenv.config()

const app = express();

app.use(cors());
app.use(express.json()); 
const randomImageId = (bytes = 8) => crypto.randomBytes(bytes).toString("hex");

const bucketName = process.env.BUCKET_NAME!;
const bucketRegion = process.env.BUCKET_REGION!;
const accessKey = process.env.ACCESS_KEY!;
const secretKey = process.env.SECRET_KEY!;

// const clerk = new Clerk(process.env.CLERK_PUBLISHABLE_KEY!)
// clerk.load()

const redisClient = createClient({
  username: 'default',
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_HOST,
    port: 14900
  }
});
redisClient.on('error', err => console.log('Redis Client Error', err));
redisClient.connect();
redisClient.set('foo', 'bar');

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

// const checkIfUserExists = async (currentUser: any) => {
//   if (!currentUser || !currentUser.id) {
//     console.error('Invalid user data');
//     return;
//   }

//   let users = [];
//   const updatedUser = { 
//     id: currentUser.id, 
//     name: currentUser.fullName, 
//     email: currentUser.emailAddresses[0].emailAddress
//   };

//   const userList = await getAllUsers();
  
//   // Ensure userList is defined
//   if (!userList) {
//     console.error('User list is not available');
//     return;
//   }

//   for (let i = 0; i < userList.length; i++) {
//     users.push(userList[i]);
//   }

//   console.log(updatedUser.id, currentUser.id);

//   if (users.includes(currentUser.id)) {
//     console.log('User exists!', users);
//   } else {
//     console.log("db hit");
//     await createUser(currentUser);
//   }
// }

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
  res.send("Server route");
});

app.get("/api/", async (req: Request, res) => {
  res.send("Server is up!");
});

// To verify the current user
app.get(
  "/api/:id/verify-user",
  requireAuth(),
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;

    try {
      // Attempt to fetch user from Redis cache
      const userString = await redisClient.get(`user:${userId}`);
      let user;

      if (!userString) {
        console.log('User not found in cache, fetching from Clerk...');

        // Fetch user from Clerk
        user = await clerkClient.users.getUser(userId);

        if (!user) {
          console.error(`User with ID ${userId} not found in Clerk`);
          res.status(404).send({ error: 'User not found' }); // Do not `return` this
          return;
        }

        // Store user in Redis cache for future requests
        await redisClient.set(`user:${userId}`, JSON.stringify(user));
      } else {
        // Parse cached user data
        user = JSON.parse(userString);

        if (!user || !user.id) {
          console.error('Invalid cached user data');
          res.status(500).send({ error: 'Internal server error' }); // Do not `return` this
          return;
        }
      }

      // Check if the user exists in your database
      // await checkIfUserExists(user);

      // console.log("User verified successfully");
      res.send({ authenticated: 'yes' }); // Do not `return` this
    } catch (error) {
      console.error('Error during user verification:', error);
      res.status(500).send({ error: 'Internal server error' }); // Do not `return` this
    }
  }
);

app.get("/api/healthz", (req: Request, res: Response) => {
  res.send({status: "ok"});
});

app.get("/api/:id/all-files", requireAuth(), async (req, res) => {
  const userId = req.params.id;
  // const user = await clerkClient.users.getUser(userId);
  const userString = await redisClient.get(`user:${userId}`)
  const userFiles = await redisClient.get(`userFiles:${userId}`)
  
  if(userFiles == null) {
    const files = await getAllFilesByUser(JSON.parse(userString!))
    await redisClient.set(`userFiles:${userId}`, JSON.stringify(files))
    console.log("from db");
  } 
  console.log(userFiles);
  res.send(userFiles)
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

    // Update files in redis
    const files = await getAllFilesByUser(JSON.parse(userString!))
    await redisClient.set(`userFiles:${userId}`, JSON.stringify(files))

    // Update usage in redis
    let sum = 0
    const allFilesDetails = await Promise.all(
      (files || []).map(file => getFileDetails(bucketName, file.key))
    );
    const resFilesDetails = allFilesDetails?.map(file => file?.ContentLength);
    resFilesDetails.forEach(num => { 
     if (num) {
      sum += num
     }
    })
    await redisClient.set(`userUsage:${userId}`, sum)

    console.log("redis update");
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

    // Update files in redis
    const files = await getAllFilesByUser(JSON.parse(userString!))
    await redisClient.set(`userFiles:${userId}`, JSON.stringify(files))

    // Update usage in redis
    let sum = 0
    const allFilesDetails = await Promise.all(
      (files || []).map(file => getFileDetails(bucketName, file.key))
    );
    const resFilesDetails = allFilesDetails?.map(file => file?.ContentLength);
    resFilesDetails.forEach(num => { 
     if (num) {
      sum += num
     }
    })
    await redisClient.set(`userUsage:${userId}`, sum)

    console.log("redis update");

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
    console.log("collecting data");
    return data;
  } catch (error) {
    console.error("Error fetching file details:", error);
  }
}



app.get("/api/:id/file-details", requireAuth(), async (req, res) => {
  const userId = req.params.id;
  const userString = await redisClient.get(`user:${userId}`)
  const usage = await redisClient.get(`userUsage:${userId}`)
  console.log("details: ", usage, "line 273")
  // const user = await clerkClient.users.getUser(userId);
  let sum = 0;
  if (usage != null) {
    console.log('redis hit');
    sum = JSON.parse(usage);
  } else {
    console.log('no redis hit');
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
    await redisClient.set(`userUsage:${userId}`, sum)
  }
  console.log("check");
  res.send({appSize: sum})
})

app.get('/api/protected', requireAuth(), (req, res) => {
  res.send('This is a protected route')
})

const interval = 14
cron.schedule(`*/${interval} * * * *`, async () => {
  console.log(`Server restarts every ${interval} minutes.`);
  try {
    const resp = await fetch("https://api.pickercdn.com/api/healthz")
    const data = await resp.json();
    console.log("Health route response: ", data);
  } catch (error) {
    console.log(error);
  }
});

const port = 3000
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
