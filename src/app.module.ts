import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationMethodModule } from './authentication_method/authentication_method.module';
import { RoleModule } from './role/role.module';
import { AuthenticatorModule } from './authenticator/authenticator.module';

@Module({
  imports: [AuthenticationMethodModule, RoleModule, AuthenticatorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
