import { Injectable } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class PlansService {
  constructor(private readonly prisma:PrismaService) {}
  async create(createPlanDto: CreatePlanDto) {
    const plan = await this.prisma.plan.create({
      data:{
        name:createPlanDto.name,
        description:createPlanDto.description,
        price:createPlanDto.price,
        duration_months:createPlanDto.duration_months,
        activated:createPlanDto.activated
      }
    })

    return plan;
  }

  async findAll() {
    const plans = await this.prisma.plan.findMany()
    return plans
  }

  async findOne(id: number) {
    const plan = await this.prisma.plan.findUnique({
      where:{id:id}
    })
    return plan
  }

  async update(id: number, updatePlanDto: UpdatePlanDto) {
    const plan = await this.prisma.plan.update({
      where:{
        id:id
      },
      data:{
        name:updatePlanDto.name,
        description:updatePlanDto.description,
        price:updatePlanDto.price,
        duration_months:updatePlanDto.duration_months,
        activated:updatePlanDto.activated
      },

    })

    return plan ;
  }

  async remove(id: number) {
    const plan = await this.prisma.plan.delete({
      where:{
        id:id
      }
    })
    return plan

  }
}
