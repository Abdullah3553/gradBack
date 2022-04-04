import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/all')
  getHello(): string {
    const t1 = this.appService.getHello()
    const t2 = this.appService.HolaAseel();
    return t1+t2;
  }
}
