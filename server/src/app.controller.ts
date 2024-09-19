import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/api/images')
  outputString(): object {
    //const sentence = `${this.appService.getHello()}, ${this.appService.sayHi()}`;
    return this.appService.sendJson();
  }
}
