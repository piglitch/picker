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

export async function createUser() {
  try {
    // Create a user
    const newUser = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "john.doe@example.com",
        files: {
          create: [
            {
              title: "My First File",
              key: "file_key_1",
            },
            {
              title: "My Second File",
              key: "file_key_2",
            },
          ],
        },
      },
    });
    
    console.log("User created: ", newUser);
  } catch (error) {
    console.error("Error creating user: ", error);
  } finally {
    await prisma.$disconnect();
  }
}