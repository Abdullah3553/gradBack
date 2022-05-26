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
import {UserModule} from "../user/user.module";
import {EncryptionService} from "../encryption/encryption.service";
import {QrMethod} from "./methods/QR/qr.method";

@Module({
  imports:[AuthenticatorModule, UserModule, ],
  controllers: [MethodsController,AuthenticationMethodController, ],
  providers: [AuthenticationMethodService,
    AuthenticationMethodSelectorService,
      EncryptionService,
    PasswordMethod,
    OtpMethod,
    FaceRecognitionMethod,
    PrismaService,
    FingerprintMethod,
    QrMethod
  ],
  exports:[AuthenticationMethodSelectorService, AuthenticationMethodService]
})
export class AuthenticationMethodModule {}
