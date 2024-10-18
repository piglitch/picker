import {
  // GetObjectCommand,
  // GetObjectCommandOutput,
  HeadObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { Stream } from 'stream';

@Injectable()
export class UploadService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });
  constructor(private readonly configService: ConfigService) {}

  async s3Upload(filename: string, file: Buffer) {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: 'custom-cdn-nestapp',
        Key: filename,
        Body: file,
      }),
    );
  }
  async listFiles(bucketname: string): Promise<any> {
    const command = new ListObjectsCommand({
      Bucket: bucketname,
    });

    try {
      const response = await this.s3Client.send(command);
      return response.Contents;
    } catch (error) {
      throw new Error(`Error in listing files: ${error.message}`);
    }
  }

  async getFileDetails(bucketname: string, key: string): Promise<any> {
    const command = new HeadObjectCommand({
      Bucket: bucketname,
      Key: key,
    });

    try {
      const response = await this.s3Client.send(command);
      return response;
    } catch (error) {
      throw new Error(`Error getting file details: ${error.message}`);
    }
  }
  // async getFiles(
  //   bucketName: string,
  //   key: string,
  // ): Promise<GetObjectCommandOutput> {
  //   const command = new GetObjectCommand({
  //     Bucket: bucketName,
  //     Key: key,
  //   });

  //   try {
  //     const response = await this.s3Client.send(command);
  //     return response; // Contains file stream and metadata
  //   } catch (error) {
  //     throw new Error(`Error fetching file: ${error.message}`);
  //   }
  // }

  // // Optional: Convert the file stream to a string (if it's a text file)
  // async streamToString(stream: Stream): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     const chunks: Uint8Array[] = [];
  //     stream.on('data', (chunk) => chunks.push(chunk));
  //     stream.on('error', reject);
  //     stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
  //   });
  // }
}
