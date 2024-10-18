import { Controller, Get, Param } from '@nestjs/common';
import { UploadService } from './s3.service';

@Controller()
export class S3ListFilesController {
  constructor(private readonly s3Service: UploadService) {}

  // Route to list all files in the bucket
  @Get('/api/app/:bucketName')
  async listFiles(@Param('bucketName') bucketName: string) {
    return this.s3Service.listFiles(bucketName);
  }

  // Route to get details of a specific file
  @Get('/api/app/:bucketName/:key/details')
  async getFileDetails(
    @Param('bucketName') bucketName: string,
    @Param('key') key: string,
  ) {
    return this.s3Service.getFileDetails(bucketName, key);
  }
}
