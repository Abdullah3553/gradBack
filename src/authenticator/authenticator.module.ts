import { Module } from '@nestjs/common';
import { AuthenticatorService } from './authenticator.service';
import { AuthenticatorController } from './authenticator.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AuthenticatorController],
  providers: [AuthenticatorService, PrismaService],
  exports:[AuthenticatorService]
})
export class AuthenticatorModule {}
