import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import dotenv from "dotenv";
import { createClerkClient } from '@clerk/backend'

dotenv.config();

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_PUBLISHABLE_KEY })
const connectionString = `${process.env.DATABASE_URL}`

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

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
  try {
    const updatedUser = await prisma.file.create({
      data: {
        title: file.title!,
        uploaderId: existingUser?.id!,
        key: file.key!,
      }
    })
    console.log('File added! ', updatedUser);
  } catch (err) {
    console.error(err);
  } finally {
    prisma.$disconnect();
  }
}

export async function deleteFileObj(emailAddress:string, fileId:string){
  try {
    const deleteFile = await prisma.file.delete({
      where: {
        key: fileId!,
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
