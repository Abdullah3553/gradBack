import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {PrismaService} from "../prisma/prisma.service";
import * as moment from 'moment' ;
import {TokenService} from "../token/token.service";



@Injectable()
export class UserService {
  constructor(private readonly prisma : PrismaService) {
  }
  private tokenService: TokenService;
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
