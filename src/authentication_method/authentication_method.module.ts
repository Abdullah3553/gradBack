import { Module } from '@nestjs/common';
import { AuthenticationMethodService } from './authentication_method.service';
import { AuthenticationMethodController } from './authentication_method.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [AuthenticationMethodController],
  providers: [AuthenticationMethodService, PrismaService],
})
export class AuthenticationMethodModule {}
