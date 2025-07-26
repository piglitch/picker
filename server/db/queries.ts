import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient()

export async function createUser(user: any) {
  try {
    // Create a user
    const existingUser = await prisma.user.findUnique({
      where: { email: user.emailAddresses[0].emailAddress },
    });
    
    if (existingUser) {
      console.log('User already stored');
      return;
    }
    const newUser = await prisma.user.create({
      data: {
        name: `${user.firstName} ${user.lastName}`,
        files: {
          create: []
        },
        email: user.emailAddresses[0].emailAddress
      },
    });
    
    console.log("User created: ", newUser);
  } catch (error) {
    console.error("Error creating user: ", error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function getAllUsers(){
  try {
    const allUsers = await prisma.user.findMany()   
    return allUsers;
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

export async function addFile(emailAddress:string, file:any){
  const existingUser = await prisma.user.findUnique({
    where: { email: emailAddress },
  });

  if (!existingUser) {
    throw new Error(`User with email ${emailAddress} not found`);
  }

  try {
    const createdFile = await prisma.file.create({
      data: {
        title: file.title!,
        uploaderId: existingUser.id,
        key: file.key!,
      },
      include: {
        uploader: true // Include the uploader relation in the response
      }
    })
    console.log('File added! ', createdFile);
    return createdFile;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await prisma.$disconnect();
  }
}

export async function deleteFileObj(emailAddress:string, fileId:string){
  try {
    const deleteFile = await prisma.file.delete({
      where: {
        id: Number(fileId),
      },
    })
    console.log('File removed: ', deleteFile);
  } catch (err) {
    console.error(err);
  } finally {
    prisma.$disconnect();
  }
}

export async function getAllFilesByUser(user: any){
  try {
    const currentUser = await prisma.user.findUnique({
      where: { email: user.emailAddresses[0].emailAddress }
    })
    const filesByUser = await prisma.file.findMany({
      where: { uploaderId: currentUser?.id }
    })
    return filesByUser;
  } catch (error) {
    console.error(error);
    
  }
}

export async function test_connection(){
 try{
    const file = await prisma.file.create({
      data: {
        title: 'admin test',
        uploaderId: 101,
        key: 'abcdadmincheck',
      }
    })
  }  catch (err) {
    console.error(err);
  } finally {
    prisma.$disconnect();
  }  
}
