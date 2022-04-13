import { Module } from '@nestjs/common';
import { PrivilegesService } from './privilges.service';
import { PrivilegesController } from './privileges.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PrivilegesController],
  providers: [PrivilegesService, PrismaService],
})
export class PrivilegesModule {}
