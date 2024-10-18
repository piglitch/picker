import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { s3UploadController } from './s3Upload.controller';
import { UploadService } from './s3.service';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { S3ListFilesController } from './s3ListFiles.controller';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 3,
      },
    ]),
    ConfigModule.forRoot(),
  ],
  controllers: [AppController, s3UploadController, S3ListFilesController],
  providers: [
    AppService,
    UploadService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
