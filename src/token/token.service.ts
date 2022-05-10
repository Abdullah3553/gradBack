import { Injectable } from '@nestjs/common';
import { UpdateTokenDto } from './dto/update-token.dto';
import {PrismaService} from "../prisma/prisma.service";
import crypto from "crypto";
const jwt = require('jsonwebtoken');



@Injectable()
export class TokenService {

  constructor(private prisma: PrismaService,) {}

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
  generateAccessToken(userId) {
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

