import { Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    const privileges = createRoleDto.privileges?.map(( privilege) => ({
      id:privilege,
    }));
    const role = await this.prisma.role.create({
      data: {
        name: createRoleDto.name,
        privileges:{
          connect:privileges,
        },
      },
    });
    return role;
  }

  async findAll() {
    return await this.prisma.role.findMany({  include: {
        privileges: true,
      },});
  }

  async findOne(id: number) {
    const request = await this.prisma.role.findUnique({
      where: {
        id: id,
      },
    include: {
      privileges: true,
    },
    });
    return request;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const privileges = updateRoleDto.privileges?.map(( privilege) => ({
      id:privilege,
    }));
    const updated_role = await this.prisma.role.update({
      where: {
        id: id,
      },
      data: {
        name: updateRoleDto.name,
        privileges:{
          connect:privileges,
        },
      },
    });
    return updated_role;
  }

  async remove(id: number) {
    const removed_role = await this.prisma.role.delete({
      where: {
        id: id,
      },
      include: {
        privileges: true,
      },
    });
    return removed_role;
  }
}
