import { Injectable } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import {PrismaService} from "../prisma/prisma.service";
const { hashToken } = require('../../utils/hashToken');

@Injectable()
export class TokenService {
  constructor(private prisma: PrismaService) {}
  create(userId: number) {
    const token = "token should be here"
    const user = this.prisma.token.create({
      data:{
        userId:userId,
        hashedToken: hashToken(token)
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
// // soft delete tokens after usage.
//  async deletetoken(id) {
//   return this.prisma.token.update({
//     where: {
//       id,
//     },
//     data: {
//       revoked: true
//     }
//   });
// }
//
// async revokeTokens(userId) {
//   return this.prisma.token.updateMany({
//     where: {
//       userId
//     },
//     data: {
//       revoked: true
//     }
//   });
// }
}


