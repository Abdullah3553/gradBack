import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {PrismaService} from "../prisma/prisma.service";
import * as moment from 'moment' ;
import {TokenService} from "../token/token.service";
import {RegisterDto} from "./dto/register.dto";
import {CreateAuthenticatorDto} from "../authenticator/dto/create-authenticator.dto";
import {AuthenticatorService} from "../authenticator/authenticator.service";
import {LoginDto} from "./dto/Login.dto";
import {AuthenticationMethodSelectorService} from "../authentication_method/authentication-method-selector.service";



@Injectable()
export class UserService {
  constructor(private readonly prisma : PrismaService,
  ) {}

  async getUserAuthenticationMethods(username:string){
    const user = await this.prisma.user.findUnique({
      where:{username},
      include:{
        Authenticator:{
          include:{
            authentication_method:true
          }
        },
      }
    })
    if(!user){
      throw new NotFoundException({message:"Wrong username"})
    }
    return {
      username:user.username,
      authentication_methods:user.Authenticator.map(obj=>{
        return{
          id:obj.authentication_method.id,
          method:obj.authentication_method.title
        }
      })
    }
  }




  async create(request: CreateUserDto) {
    let user = await this.prisma.user.create({
      data:{
        username:request.username,
        email:request.email,
        birth_date:moment(request.birth_date).toDate(),
        country:request.country,
        city:request.city,
        street:request.street,
        role_id:request.role_id?request.role_id:null
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
    if(request.role_id){
      const roledUser = await this.prisma.user.update({
        where:{id:user.id},
        data:{
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
      })
      return roledUser
    }
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

  async findOneByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where:{
        username
      },
      select:{
        id: true,
        username: true,
        birth_date: true,
        email: true,
        country: true,
        street: true,
        city: true,
        role:true,
        Authenticator:{
          orderBy:{
            priority:'asc'
          },
          include:{authentication_method:true}
        }
      },

    });
    if(!user){
      throw new NotFoundException({Message:`User ${username} not found`})
    }
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
