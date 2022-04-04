import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Tst1Service } from './tst1.service';
import { CreateTst1Dto } from './dto/create-tst1.dto';
import { UpdateTst1Dto } from './dto/update-tst1.dto';

@Controller('tst1')
export class Tst1Controller {
  constructor(private readonly tst1Service: Tst1Service) {}

  @Post('create')
  create(@Body() createTst1Dto: CreateTst1Dto) {
    return this.tst1Service.create(createTst1Dto);
  }

  @Get('/all')
  findAll() {
    return this.tst1Service.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.tst1Service.findOne(+id);
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() updateTst1Dto: UpdateTst1Dto) {
    return this.tst1Service.update(+id, updateTst1Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tst1Service.remove(+id);
  }
}
