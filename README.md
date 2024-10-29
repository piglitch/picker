
# CDN App

A content delivery network (CDN) application that enables users to securely upload, store, and retrieve image files. Built with Node.js, Express, AWS S3, PostgreSQL, Clerk for authentication, and Prisma as the ORM.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Project](#running-the-project)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Future Enhancements](#future-enhancements)

## Features
- Secure user authentication with Clerk
- Image storage with AWS S3
- PostgreSQL integration for metadata management
- Efficient image retrieval by user ID

## Tech Stack
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: AWS S3
- **Authentication**: Clerk
- **ORM**: Prisma

## Getting Started

### Prerequisites
- Node.js (v16 or above)
- PostgreSQL database
- AWS account (for S3 bucket)
- Clerk account (for user authentication)

Clone the repository:
```bash
git clone <repository-url>
cd cdn-app
```

Install dependencies:
```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```plaintext
PORT=3000
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
AWS_ACCESS_KEY_ID=<your-aws-access-key>
AWS_SECRET_ACCESS_KEY=<your-aws-secret-key>
AWS_REGION=<your-aws-region>
S3_BUCKET_NAME=<your-s3-bucket-name>
CLERK_FRONTEND_API=<your-clerk-frontend-api>
CLERK_API_KEY=<your-clerk-api-key>
```

## Database Setup

Initialize the database with Prisma:
```bash
npx prisma migrate dev
```

Run the following command to generate Prisma client:
```bash
npx prisma generate
```

## Running the Project

To start the server:
```bash
npm start
```

The server should be running on `http://localhost:3000`.

## Usage

1. **Register/Login**: Users authenticate through Clerk.
2. **Upload Image**: Upload an image file to the CDN, which stores it in an S3 bucket and saves metadata to PostgreSQL.
3. **Retrieve Images**: Fetch all images uploaded by a specific user based on user ID.

## API Endpoints

### Authentication
Authentication is managed by Clerk. Make sure to include an authentication token in headers where required.

### Image Upload
- **Endpoint**: `/upload`
- **Method**: `POST`
- **Headers**: `{ "Authorization": "Bearer <token>" }`
- **Description**: Upload an image. The server saves it in S3 and records metadata in PostgreSQL.

### Retrieve Images by User
- **Endpoint**: `/images/:userId`
- **Method**: `GET`
- **Headers**: `{ "Authorization": "Bearer <token>" }`
- **Description**: Retrieves all images uploaded by a specified user.

## Future Enhancements
- Extend support for additional file types
- Implement caching for faster image retrieval
- Add analytics for tracking image access patterns

## License
This project is licensed under the MIT License.
