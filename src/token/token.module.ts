import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { PrismaService } from '../prisma/prisma.service';
import {UserModule} from "../user/user.module";
import { AuthenticatorModule } from 'src/authenticator/authenticator.module';
@Module({
  imports:[UserModule, AuthenticatorModule],
  controllers: [TokenController],
  providers: [TokenService, PrismaService],
  exports: [TokenService]
})
export class TokenModule {}
