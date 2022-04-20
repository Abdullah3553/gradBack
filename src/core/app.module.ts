import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationMethodModule } from '../authentication_method/authentication_method.module';
import { RoleModule } from '../role/role.module';
import { AuthenticatorModule } from '../authenticator/authenticator.module';
import { UserModule } from '../user/user.module';
import {PrivilegesModule} from "../privileges/privileges.module";

@Module({
  imports: [AuthenticationMethodModule, RoleModule, AuthenticatorModule, UserModule ,PrivilegesModule], // @TODO @Omniaashraf123 Adding privileges module
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
