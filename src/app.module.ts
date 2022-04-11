import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { Service } from './service';
import { AuthenticationMethodModule } from './authentication_method/authentication_method.module';

@Module({
  imports: [AuthenticationMethodModule],
  controllers: [AppController],
  providers: [Service],
})
export class AppModule {}
