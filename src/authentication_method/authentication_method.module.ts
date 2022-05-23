import { Module } from '@nestjs/common';
import { AuthenticationMethodService } from './authentication_method.service';
import { AuthenticationMethodController } from './authentication_method.controller';
import { PrismaService } from '../prisma/prisma.service';
import {AuthenticationMethodSelectorService} from "./authentication-method-selector.service";
import {PasswordMethod} from "./methods/password/password.method";
import {OtpMethod} from "./methods/OTP/otp.method";
import {FaceRecognitionMethod} from "./methods/face_recognition/faceRecognition.method";
import {AuthenticatorModule} from "../authenticator/authenticator.module";
import {MethodsController} from "./methods/methods.controller";
import {FingerprintMethod} from "./methods/Fingerprint/fingerprint.method";

@Module({
  imports:[AuthenticatorModule],
  controllers: [MethodsController,AuthenticationMethodController, ],
  providers: [AuthenticationMethodService,
    AuthenticationMethodSelectorService,
    PasswordMethod,
    OtpMethod,
      FaceRecognitionMethod,
    PrismaService,
    FingerprintMethod
  ],
  exports:[AuthenticationMethodSelectorService]
})
export class AuthenticationMethodModule {}
