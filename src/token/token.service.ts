import { Injectable } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import {PrismaService} from "../prisma/prisma.service";
import crypto from "crypto";
import {RegisterDto} from "./dto/register.dto";
import {UserService} from "../user/user.service";
import {CreateUserDto} from "../user/dto/create-user.dto";
import { AuthenticatorService } from 'src/authenticator/authenticator.service';
import { CreateAuthenticatorDto } from 'src/authenticator/dto/create-authenticator.dto';
const jwt = require('jsonwebtoken');



@Injectable()
export class TokenService {

  constructor(private prisma: PrismaService,
              private userService: UserService,
              private authenticatorService: AuthenticatorService
  ) {}

  private hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async createRefreshToken(userId: number) {
    const generatedToken = await this.prisma.token.create({
      data:{
        userId:userId
      }
    })
    const token = this.generateRefreshToken(userId, generatedToken.id)
    const updatedToken = await this.prisma.token.update({
      where:{id:generatedToken.id},
      data:{
        hashedToken: this.hashToken(token)
      }
    })
    return updatedToken;
  }

  async findAll() {
    const tokens = await this.prisma.token.findMany()
    return tokens ;
  }

  async findOne(id: string) {
    const token = await this.prisma.token.findUnique({
      where:{
        id:id
      }
    })
    return token;
  }

  async update(id: string, updateTokenDto: UpdateTokenDto) {
    const token = await this.prisma.token.update({
      where:{
        id:id
      },
      data:{
        hashedToken:updateTokenDto.hashedToken,
        revoked:updateTokenDto.revoked
      }
    })
    return token
  }

  async remove(id: string) {
    const token = await this.prisma.token.delete({
      where:{
        id:id
      }
    })
    return token
  }
  async deleteToken(id) {
    return await this.prisma.token.update({
      where: {
        id,
      },
      data: {
        revoked: true
      }
    });
  }

  async revokeTokens(userId) {
    return this.prisma.token.updateMany({
      where: {
        userId
      },
      data: {
        revoked: true
      }
    });
  }


// Usually I keep the token between 5 minutes - 15 minutes
  private generateAccessToken(userId) {
    return jwt.sign({ userId: userId }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '5m',
    });
  }
  private generateRefreshToken(userId, jti) {
    return jwt.sign({
      userId: userId,
      jti:jti
    }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '8h',
    });
  }

  generateTokens(userId, jti) {
    const accessToken = this.generateAccessToken(userId);
    const refreshToken = this.generateRefreshToken(userId, jti);

    return {
      accessToken,
      refreshToken,
    };
  }
  async registerNewUser(user:RegisterDto){
    /*
    to register a user we need to do 3 things :
     1) Create and store a new user with the sent user data and the default role
     2) use the generated userId to create and store all sent authenticators
     3) Generate the access token and refresh token and send it as a response to that user (in other words login for that user)
    */
    const newUser = await this.userService.create(user)//step 1
    for(let i =0, arr=user.authenticators;i<arr.length;i++){
      const auth_method = arr[i];
      let authenticator = new CreateAuthenticatorDto()
      authenticator = {...auth_method, userId:newUser.id}
      await this.authenticatorService.create(authenticator)//step 2
    }
    const refreshToken = await this.createRefreshToken(newUser.id)
    const accessToken = this.generateAccessToken(newUser.id)

    return{
      refreshToken:refreshToken.hashedToken,
      accessToken:accessToken
    }
  }

};


// used when we create a refresh token.
// async addtokenToWhitelist({ jti, token, userId }) {
//   return this.prisma.token.create({
//     data: {
//       id: jti,
//       hashedToken: hashToken(token),
//       userId
//     },
//   });
// }
//
// // used to check if the token sent by the client is in the database.
// async findtokenById(id) {
//   return this.prisma.token.findUnique({
//     where: {
//       id,
//     },
//   });
// }
//

