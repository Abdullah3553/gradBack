import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {PrismaService} from "../prisma/prisma.service";
import {AuthenticatorModule} from "../authenticator/authenticator.module";
import {TokenModule} from "../token/token.module";
import {AuthenticationMethodModule} from "../authentication_method/authentication_method.module";

@Module({
  imports:[AuthenticatorModule, TokenModule, AuthenticationMethodModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports:[UserService]
})
export class UserModule {}
