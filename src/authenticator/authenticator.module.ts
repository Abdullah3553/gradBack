import {forwardRef, Module} from '@nestjs/common';
import { AuthenticatorService } from './authenticator.service';
import { AuthenticatorController } from './authenticator.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import {AuthenticationMethodModule} from "../authentication_method/authentication_method.module";
import {EncryptionService} from "../encryption/encryption.service";

@Module({
  imports:[forwardRef(()=>AuthenticationMethodModule)],
  controllers: [AuthenticatorController],
  providers: [AuthenticatorService, PrismaService, EncryptionService],
  exports:[AuthenticatorService]
})
export class AuthenticatorModule {}
