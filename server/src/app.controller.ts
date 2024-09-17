import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  outputString(): string {
    const sentence = `${this.appService.getHello()}, ${this.appService.sayHi()}`;
    return sentence;
  }
}
