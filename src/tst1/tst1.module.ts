import { Module } from '@nestjs/common';
import { Tst1Service } from './tst1.service';
import { Tst1Controller } from './tst1.controller';

@Module({
  controllers: [Tst1Controller],
  providers: [Tst1Service]
})
export class Tst1Module {}
