import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationMethodModule } from '../authentication_method/authentication_method.module';
import { RoleModule } from '../role/role.module';
import { AuthenticatorModule } from '../authenticator/authenticator.module';
import { UserModule } from '../user/user.module';
import {PrivilegesModule} from "../privileges/privileges.module";
import {EncryptionService} from "../encryption/encryption.service";

@Module({
  imports: [AuthenticationMethodModule, RoleModule, AuthenticatorModule, UserModule ,PrivilegesModule, EncryptionService],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
