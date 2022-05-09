import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { PrismaService } from '../prisma/prisma.service';
import {UserModule} from "../user/user.module";
@Module({
  imports:[UserModule],
  controllers: [TokenController],
  providers: [TokenService, PrismaService],
  exports: [TokenService]
})
export class TokenModule {}
