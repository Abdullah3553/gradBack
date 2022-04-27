import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post('/new')
  create(@Body() createPlanDto: CreatePlanDto) {
    return this.plansService.create(createPlanDto);
  }

  @Get('/find/all')
  findAll() {
    return this.plansService.findAll();
  }

  @Get('/find/:id')
  findOne(@Param('id') id: string) {
    return this.plansService.findOne(Number(id));
  }

  @Patch('/update/:id')
  update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.plansService.update(Number(id), updatePlanDto);
  }

  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return this.plansService.remove(Number(id));
  }
}
