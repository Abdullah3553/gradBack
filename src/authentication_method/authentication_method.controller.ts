import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthenticationMethodService } from './authentication_method.service';
import { CreateAuthenticationMethodDto } from './dto/create-authentication_method.dto';
import { UpdateAuthenticationMethodDto } from './dto/update-authentication_method.dto';

@Controller('authentication-method')
export class AuthenticationMethodController {
  constructor(private readonly authenticationMethodService: AuthenticationMethodService) {}

  @Post('/new') //to take the data from user
  create(@Body() request_body: CreateAuthenticationMethodDto) {
    return this.authenticationMethodService.create(request_body);
  }

  @Get('/find/all')
  findAll(){
    return this.authenticationMethodService.findAll();
  }

  @Get('/find/:id')
  findOne(@Param('id') id: string ) {
    return this.authenticationMethodService.findOne(Number(id));
  }

  @Patch('/update/:id')
  update(@Param('id') id: string, @Body() updateAuthenticationMethodDto: UpdateAuthenticationMethodDto) {
    return this.authenticationMethodService.update( Number(id), updateAuthenticationMethodDto);
  }

  @Delete('/delete/:id')
  remove(@Param('id') id:string) {
    return this.authenticationMethodService.remove(Number(id));
  }

}
