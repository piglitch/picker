import { Injectable } from '@nestjs/common';
import { dummyData } from './constants-server/dummyData';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  sendJson(): object {
    return dummyData;
  }
}
