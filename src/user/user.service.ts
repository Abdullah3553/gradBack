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
              private readonly tokenService: TokenService,
              private readonly authenticatorService: AuthenticatorService,
              private readonly authenticationMethodSelector: AuthenticationMethodSelectorService
  ) {}

  async login(userData:LoginDto){
    const userChecker = await this.prisma.user.findUnique({
      where:{username:userData.username},
      include: {
        Authenticator: {
          include: {
            authentication_method: true
          }
        }
      }
    })
     //return userChecker // for API testing ...
    if(!userChecker){
      throw new NotFoundException({message:"User not found"})
    }
    userChecker.Authenticator.sort((obj1, obj2)=>{
      return obj1.priority - obj2.priority  // sort by priority
    })
    userData.authenticators.sort((obj1, obj2)=>{
      return obj1.priority - obj2.priority  // sort by priority
    })

    let isUserValid = 0;// 1 -> valid user , 0 -> invalid user
    for(let i=0, arr=userData.authenticators;i<arr.length;i++){
      // For each method we should execute that method module to validate signatures data
      //1)Sequence checking
      if(arr[i].authentication_methodId === userChecker.Authenticator[i].authentication_methodId){
        // the [i] method is in the right sequence
        // so we must check the signature data
        const isAuthenticated = this.authenticationMethodSelector.methodSelector(
            userChecker.Authenticator[i],
            userChecker.username,
            userChecker.Authenticator[i].signature,
            userData.authenticators[i].signature
            )
        if(!isAuthenticated){
          // the authenticator sent by the user doesn't match the stored data
          isUserValid = 0;
          throw new BadRequestException({message:"Wrong credentials"})
        }
        // line after this comment means that the user authenticators are valid
        isUserValid = 1;
      }else{
        throw new BadRequestException({message:"Wrong Sequence"})
      }
    }
    if(isUserValid === 1){
      // we should generate tokens for the user and return them
      const refreshToken = await this.tokenService.createRefreshToken(userChecker.id)
      const accessToken = this.tokenService.generateAccessToken(userChecker.id)
      return {
        refreshToken:refreshToken.hashedToken,
        accessToken
      }
    }
  }

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


  async registerNewUser(user:RegisterDto){
    /*
    to register a user we need to do 3 things :
     1) Create and store a new user with the sent user data and the default role -
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
