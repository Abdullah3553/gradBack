import {forwardRef, Module} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {PrismaService} from "../prisma/prisma.service";
import {AuthenticatorModule} from "../authenticator/authenticator.module";
import {TokenModule} from "../token/token.module";
import {AuthenticationMethodModule} from "../authentication_method/authentication_method.module";
import {GuestService} from "./guest.service";

@Module({
  imports:[AuthenticatorModule, TokenModule, forwardRef(()=>AuthenticationMethodModule) ],
  controllers: [UserController],
  providers: [UserService, PrismaService, GuestService],
  exports:[UserService]
})
export class UserModule {}
