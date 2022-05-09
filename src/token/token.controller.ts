import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TokenService } from './token.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import {RegisterDto} from "./dto/register.dto";


@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('/register')
  register(@Body() req: RegisterDto)
  {

  }

  @Get('new/user/:id')
  create(@Param('id') id: string) {
    return this.tokenService.create(Number(id));
  }

  @Get('find/all')
  findAll() {
    return this.tokenService.findAll();
  }

  @Get('find/:id')
  findOne(@Param('id') id: string) {
    return this.tokenService.findOne(id);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateTokenDto: UpdateTokenDto) {
    return this.tokenService.update(id, updateTokenDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.tokenService.remove(id);
  }
}
