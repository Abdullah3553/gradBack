import { Injectable } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import {PrismaService} from "../prisma/prisma.service";
import crypto from "crypto";
import {RegisterDto} from "./dto/register.dto";
import {UserService} from "../user/user.service";
import {CreateUserDto} from "../user/dto/create-user.dto";
const jwt = require('jsonwebtoken');



@Injectable()
export class TokenService {

  constructor(private prisma: PrismaService,private userService: UserService) {}

  private hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  create(userId: number) {
    const token = this.generateAccessToken(userId)
    const user = this.prisma.token.create({
      data:{
        userId:userId,
        hashedToken: this.hashToken(token)
      }
    })
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
  async deletetoken(id) {
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
  private generateRefreshToken(user, jti) {
    return jwt.sign({
      userId: user.id,
      jti:jti
    }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '8h',
    });
  }

    generateTokens(user, jti) {
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user, jti);

      return {
        accessToken,
        refreshToken,
      };
    }
   async createNewUser(user:RegisterDto){
    const newUser = await this.userService.create(user)
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

