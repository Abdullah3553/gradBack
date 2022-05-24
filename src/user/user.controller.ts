import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {RegisterDto} from "./dto/register.dto";
import {LoginDto} from "./dto/Login.dto";
import {GuestService} from "./guest.service";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
              private readonly guestService:GuestService
              ) {}

  @Post('/register')
  register(@Body() req: RegisterDto)
  {
    return this.guestService.registerNewUser(req)
  }

  @Post('/register/check')
  checkUserIdentifiers(@Body() body){
    return this.guestService.checkUserIdentifiers(body.username, body.email)
  }

  @Post('/login')
  login(@Body() req:LoginDto){
    return this.guestService.login(req)
  }

  @Post('/new')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('/find/authentication_methods/:username')
  getAuthenticationMethods(@Param('username') username:string){
    return this.userService.getUserAuthenticationMethods(username);
  }

  @Get('/find/all')
  findAll() {
    return this.userService.findAll();
  }

  @Get('/find/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch('/update/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
