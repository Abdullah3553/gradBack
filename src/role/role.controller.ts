import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('/new')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get('/find/all')
  findAll() {
    return this.roleService.findAll();
  }

  @Get('/find/:id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(Number(id));
  }

  @Patch('/update/:id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(Number(id), updateRoleDto);
  }

  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(Number(id));
  }
}
