import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Tst1Module } from './tst1/tst1.module';

@Module({
  imports: [Tst1Module],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
