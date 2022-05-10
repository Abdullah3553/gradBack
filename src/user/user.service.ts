import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {PrismaService} from "../prisma/prisma.service";
import * as moment from 'moment' ;
import {TokenService} from "../token/token.service";
import {RegisterDto} from "./dto/register.dto";
import {CreateAuthenticatorDto} from "../authenticator/dto/create-authenticator.dto";
import {AuthenticatorService} from "../authenticator/authenticator.service";



@Injectable()
export class UserService {
  constructor(private readonly prisma : PrismaService,
              private tokenService: TokenService,
              private authenticatorService: AuthenticatorService
  ) {}


  async registerNewUser(user:RegisterDto){
    /*
    to register a user we need to do 3 things :
     1) Create and store a new user with the sent user data and the default role
     2) use the generated userId to create and store all sent authenticators
     3) Generate the access token and refresh token and send it as a response to that user (in other words login for that user)
    */
    const newUser = await this.create(user)//step 1
    for(let i =0, arr=user.authenticators;i<arr.length;i++){
      const auth_method = arr[i];
      let authenticator = new CreateAuthenticatorDto()
      authenticator = {...auth_method, userId:newUser.id}
      await this.authenticatorService.create(authenticator)//step 2
    }
    const refreshToken = await this.tokenService.createRefreshToken(newUser.id)
    const accessToken = this.tokenService.generateAccessToken(newUser.id)

    return{
      refreshToken:refreshToken.hashedToken,
      accessToken:accessToken
    }
  }

  async create(request: CreateUserDto) {
    const user = await this.prisma.user.create({
      data:{
        username:request.username,
        email:request.email,
        birth_date:moment(request.birth_date).toDate(),
        country:request.country,
        city:request.city,
        street:request.street,
        role:{
          connect:{
            id:request.role_id
          }
        }
      },
      select:{
        id: true,
        username: true,
        birth_date: true,
        email: true,
        country: true,
        street: true,
        city: true,
        role:true
      },
    });
    return user;
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      select:{
        id: true,
        username: true,
        birth_date: true,
        email: true,
        country: true,
        street: true,
        city: true,
        role:true
      },

    });
    return users;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where:{
        id:id
      },
      select:{
        id: true,
        username: true,
        birth_date: true,
        email: true,
        country: true,
        street: true,
        city: true,
        role:true
      },
    });

    return user;
  }

  async update(id: number, request: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where:{
        id:id
      },
      data:{
        username:request.username,
        email:request.email,
        birth_date:moment(request.birth_date).toDate(),
        country:request.country,
        city:request.city,
        street:request.street
      },
      select:{
        id: true,
        username: true,
        birth_date: true,
        email: true,
        country: true,
        street: true,
        city: true,
        role:true
      },
    });

    return user;
  }

  async remove(id: number) {
    const user = await this.prisma.user.delete({
      where:{
        id:id
      },
      select:{
        id: true,
        username: true,
        birth_date: true,
        email: true,
        country: true,
        street: true,
        city: true,
        role:true
      },
    });

    return user ;
  }
}
