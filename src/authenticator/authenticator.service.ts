import { Injectable } from '@nestjs/common';
import { CreateAuthenticatorDto } from './dto/create-authenticator.dto';
import { UpdateAuthenticatorDto } from './dto/update-authenticator.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthenticatorService {
  constructor(private prisma: PrismaService) {}

  async create(createAuthenticatorDto: CreateAuthenticatorDto) {
    const user = await this.prisma.authenticator.create({
      data: {
        signature: createAuthenticatorDto.signature,
        priority: createAuthenticatorDto.priority,
        access_token: createAuthenticatorDto.access_token,
      },
    });

    return user;
  }

  async findAll() {
    return await this.prisma.authenticator.findMany();
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
