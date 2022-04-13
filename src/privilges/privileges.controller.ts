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
import { CreatePriviledgeDto } from './dto/create-priviledge.dto';
import { UpdatePriviledgeDto } from './dto/update-priviledge.dto';

@Controller('privileges')
export class PrivilegesController {
  constructor(private readonly priviledgesService: PrivilegesService) {}

  @Post('/new') //take data from user
  create(@Body() createPriviledgeDto: CreatePriviledgeDto) {
    return this.priviledgesService.create(createPriviledgeDto);
  }

  @Get('/find/all')
  findAll() {
    return this.priviledgesService.findAll();
  }

  @Get('/find/:id')
  findOne(@Param('id') id: CreatePriviledgeDto) {
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
  remove(@Param('id') id: CreatePriviledgeDto) {
    return this.priviledgesService.remove(+id);
  }
}
