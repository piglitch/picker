import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  sayHi(): string {
    return 'Hi pals';
  }
  sendJson(): object {
    const resp = {
      status: 'ok',
    };
    return resp;
  }
}
