import { Injectable } from '@nestjs/common';
import { CreateAuthenticatorDto } from './dto/create-authenticator.dto';
import { UpdateAuthenticatorDto } from './dto/update-authenticator.dto';
import { PrismaService } from '../prisma/prisma.service';
import { userInfo } from 'os';
import { User } from '@prisma/client';
import { identity } from 'rxjs';

@Injectable()
export class AuthenticatorService {
  constructor(private prisma: PrismaService) {}

  async create(createAuthenticatorDto: CreateAuthenticatorDto) {
    const auth = await this.prisma.authenticator.create({
      data: {
        signature: createAuthenticatorDto.signature,
        priority: createAuthenticatorDto.priority,
        access_token: createAuthenticatorDto.access_token,
        user: {
          connect: {
            id: createAuthenticatorDto.userId,
          },
        },
        authentication_method:{
          connect:{
            id: createAuthenticatorDto.authentication_methodId,
          },
        },
      },
    });

    return auth;
  }

  async findAll() {
    return await this.prisma.authenticator.findMany();
  }

  async findByuserId(userId: number) {
    return await this.prisma.authenticator.findMany({
      where: {
        userId: userId,
      },
    });
  }
  async findOne(id: number) {
    return await this.prisma.authenticator.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(id: number, updateAuthenticatorDto: UpdateAuthenticatorDto) {
    const updateUser = await this.prisma.authenticator.update({
      where: {
        id: id,
      },
      data: {
        signature: updateAuthenticatorDto.signature,
        priority: updateAuthenticatorDto.priority,
        access_token: updateAuthenticatorDto.access_token,
      },
    });
    return updateUser;
  }

  async remove(id: number) {
    return await this.prisma.authenticator.delete({
      where: {
        id: id,
      },
    });
  }
}
