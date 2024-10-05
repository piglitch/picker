import {
  Controller,
  // FileTypeValidator,
  // MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './s3.service';

@Controller()
export class s3UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Post('/api/s3-upload/')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 1000 }),
          // new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Res() res,
  ) {
    const result = await this.uploadService.s3Upload(
      file.originalname,
      file.buffer,
    );
    res.send({
      result,
    });
  }
}
