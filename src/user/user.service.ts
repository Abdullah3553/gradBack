import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {PrismaService} from "../prisma.service";
import * as moment from 'moment' ;

@Injectable()
export class UserService {
  constructor(private readonly prisma : PrismaService) {
  }
  async create(request: CreateUserDto) {
    const user = await this.prisma.user.create({
      data:{
        username:request.username,
        email:request.email,
        birth_date:moment(request.birth_date).toDate(),
        country:request.country,
        city:request.city,
        street:request.street
      }
    });
    return user;
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where:{
        id:id
      }
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
      }
    });

    return user;
  }

  async remove(id: number) {
    const user = await this.prisma.user.delete({
      where:{
        id:id
      }
    });

    return user ;
  }
}
