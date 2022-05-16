import { Module } from '@nestjs/common';
import { AuthenticationMethodService } from './authentication_method.service';
import { AuthenticationMethodController } from './authentication_method.controller';
import { PrismaService } from '../prisma/prisma.service';
import {AuthenticationMethodSelectorService} from "./authentication-method-selector.service";
import {PasswordMethod} from "./methods/password/password.method";
import {AuthenticatorService} from "../authenticator/authenticator.service";
import {MethodsController} from "./methods/methods.controller";

@Module({
  imports:[AuthenticatorService],
  controllers: [AuthenticationMethodController, MethodsController],
  providers: [AuthenticationMethodService,
    PrismaService,
    AuthenticationMethodSelectorService,
    PasswordMethod
  ],
  exports:[AuthenticationMethodSelectorService]
})
export class AuthenticationMethodModule {}
