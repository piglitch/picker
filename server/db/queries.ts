import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import dotenv from "dotenv";
import { createClerkClient } from '@clerk/backend'

dotenv.config();

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
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
        name: user.fullName,
        files: {
          create: [
            {
              title: "My First File01",
              key: "file_key_1_01",
            },
            {
              title: "My Second File02",
              key: "file_key_2_02",
            },
          ],
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