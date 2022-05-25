import { Injectable } from '@nestjs/common';
import { CreateAuthenticatorDto } from './dto/create-authenticator.dto';
import { UpdateAuthenticatorDto } from './dto/update-authenticator.dto';
import { PrismaService } from '../prisma/prisma.service';
import {EncryptionService} from "../encryption/encryption.service";

@Injectable()
export class AuthenticatorService {
  constructor(private prisma: PrismaService,
              private readonly encryptionService : EncryptionService
              ) {}

  async create(createAuthenticatorDto: CreateAuthenticatorDto) {
    const authenticationMethod = await this.prisma.authentication_method.findUnique(
        {where:{id:createAuthenticatorDto.authentication_methodId}});
    let auth
    if(authenticationMethod.revresable){
      //use rsa for encryption
      auth = await this.prisma.authenticator.create({
        data: {
          signature: this.encryptionService.rsaEncrypt(createAuthenticatorDto.signature),
          priority: Number(createAuthenticatorDto.priority),
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
    }else{
      // use sha256 fro encryption
      auth = await this.prisma.authenticator.create({
        data: {
          signature: this.encryptionService.sha256Encrypt(createAuthenticatorDto.signature),
          priority: Number(createAuthenticatorDto.priority),
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
    }
    return auth;
  }

  async findAll() {
    return await this.prisma.authenticator.findMany({
      include:{
        authentication_method:true,
        user:true
      }
    });
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
      include:{
        authentication_method:true,
        user:true
      }
    });
  }

  async update(id: number, updateAuthenticatorDto: UpdateAuthenticatorDto) {
    const authenticationMethod = await this.prisma.authentication_method.findUnique(
        {where:{id:updateAuthenticatorDto.authentication_methodId}});
    let updateUser;
    if(authenticationMethod.revresable){
      updateUser = await this.prisma.authenticator.update({
        where: {
          id: id,
        },
        data: {
          signature: this.encryptionService.rsaEncrypt(updateAuthenticatorDto.signature),
          priority: Number(updateAuthenticatorDto.priority) ,
        },
      });
    }else{
      updateUser = await this.prisma.authenticator.update({
        where: {
          id: id,
        },
        data: {
          signature: this.encryptionService.sha256Encrypt(updateAuthenticatorDto.signature),
          priority: Number(updateAuthenticatorDto.priority) ,
        },
      });
    }
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
