# Picker - A CDN for Developer Assets

Picker is a Content Delivery Network (CDN) service tailored for developers. It allows users to securely upload, manage, and access assets like images, icons, and other files via a simple interface. Built with scalability and performance in mind, Picker is ideal for developers who need a reliable platform to host assets without storing them directly in their applications.

## Why Choose Picker?

- **Quick and Simple**: No complicated setup – just log in and start uploading your files.
- **No Bank Account Required**: Use Picker without the hassle of linking a bank account.
- **Seamless Integration**: Easily integrate hosted assets into your development projects using public URLs.
- **Developer-Friendly**: Designed specifically with developers in mind, focusing on simplicity and performance.

## How It Works

1. **Authentication**: Users sign up or log in using Clerk for secure and easy authentication.
2. **File Uploads**: Authenticated users can upload their files, which are securely stored in an AWS S3 bucket.
3. **File Management**: Each uploaded file is tagged with a unique identifier linked to the user, enabling efficient retrieval of all files associated with a specific user.
4. **Data Management**: PostgreSQL is used to store metadata for each file, including user details, file IDs, and other relevant information, which simplifies querying and file management.
5. **Caching**: To optimize performance, user session and frequently accessed data are cached in Redis, reducing the need for repetitive database calls.
6. **Public Access Links**: Uploaded files are accessible through unique URLs, making it easy for users to integrate their assets directly into their applications as CDN resources.

## Tech Stack

- **Backend**: Node.js, Express
- **Frontend**: React
- **Authentication**: Clerk
- **Storage**: AWS S3
- **Database**: PostgreSQL
- **Caching**: Redis
- **Deployment**: AWS EC2 (t2.medium)

## Features

- Secure and scalable storage of developer assets
- Easy-to-use authentication and user management with Clerk
- Efficient data management and caching to enhance performance
- Public URLs for assets, ideal for use as a CDN in development projects

## License

This project is licensed under the MIT License.