import { Module } from '@nestjs/common';
import { AuthenticationMethodService } from './authentication_method.service';
import { AuthenticationMethodController } from './authentication_method.controller';
import { PrismaService } from '../prisma/prisma.service';
import {AuthenticationMethodSelectorService} from "./authentication-method-selector.service";
import {PasswordMethod} from "./methods/password/password.method";
import {MethodsController} from "./methods/methods.controller";
import {OtpMethod} from "./methods/OTP/otp.method";
import {FaceRecognitionMethod} from "./methods/face_recognition/faceRecognition.method";
import {AuthenticatorModule} from "../authenticator/authenticator.module";

@Module({
  imports:[AuthenticatorModule],
  controllers: [AuthenticationMethodController, MethodsController],
  providers: [AuthenticationMethodService,
    PrismaService,
    AuthenticationMethodSelectorService,
    PasswordMethod,
    OtpMethod,
      FaceRecognitionMethod
  ],
  exports:[AuthenticationMethodSelectorService]
})
export class AuthenticationMethodModule {}
