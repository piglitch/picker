// app.post("/api/:id/s3-upload/", upload.single("file"), async (req: Request, res: Response) => {
//   try {
//     const userId = req.params.id;

//     // Fetch user from Redis
//     const userString = await redisClient.get(`user:${userId}`);
//     if (!userString) {
//       return res.status(404).send({ status: 'User not found in cache' });
//     }
//     const user = JSON.parse(userString);

//     // Check if file exists in the request
//     if (!req.file) {
//       return res.status(400).send({ status: 'No file uploaded' });
//     }

//     // Validate user email
//     const emailAddress = user?.emailAddresses?.[0]?.emailAddress;
//     if (!emailAddress) {
//       return res.status(400).send({ status: 'User email not found' });
//     }

//     // Set up parameters for S3 upload
//     const params = {
//       Bucket: bucketName,
//       Key: randomImageId(),
//       Body: req.file.buffer,
//       ContentType: req.file.mimetype,
//     };

//     const userFile = {
//       id: params.Key,
//       title: req.file.originalname,
//       uploaderId: userId,
//       key: params.Key
//     };

//     // Upload to S3
//     const putObjCommand = new PutObjectCommand(params);
//     await s3.send(putObjCommand);

//     // Add file info to your database or storage system
//     addFile(emailAddress, userFile);

//     // Respond with success message
//     res.status(200).send({ status: `${req.file.originalname} is uploaded!` });
//   } catch (err) {
//     // Log and handle error properly
//     console.error("Upload error:", err);
//     res.status(500).send({ status: err instanceof Error ? err.message : 'Unknown error' });
//   }
// });
