import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PrivilegesService } from './privilges.service';
import { CreatePrivilegeDto } from './dto/create-privilege.dto';
import { UpdatePriviledgeDto } from './dto/update-priviledge.dto';

@Controller('privileges')
export class PrivilegesController {
  constructor(private readonly priviledgesService: PrivilegesService) {}

  @Post('/new') //take data from user
  create(@Body() createPriviledgeDto: CreatePrivilegeDto) {
    return this.priviledgesService.create(createPriviledgeDto);
  }

  @Get('/find/all')
  findAll() {
    return this.priviledgesService.findAll();
  }

  @Get('/find/role/:id')
  findByRoleId(@Param('id') id: string) {
    return this.priviledgesService.findAllByRoleId(Number(id));
  }

  @Get('/find/:id')
  findOne(@Param('id') id: CreatePrivilegeDto) {
    return this.priviledgesService.findOne(+id);
  }

  @Patch('/update/:id')
  update(
    @Param('id') id: string,
    @Body() updatePriviledgeDto: UpdatePriviledgeDto,
  ) {
    return this.priviledgesService.update(+id, updatePriviledgeDto);
  }

  @Delete('/delete/:id')
  remove(@Param('id') id: CreatePrivilegeDto) {
    return this.priviledgesService.remove(+id);
  }
}
