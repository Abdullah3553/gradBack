import { Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    const role = await this.prisma.role.create({
      data: {
        name: createRoleDto.name,
      },
    });
    return role;
  }

  async findAll() {
    return await this.prisma.role.findMany();
  }

  async findOne(id: number) {
    const request = await this.prisma.role.findUnique({
      where: {
        id: id,
      },
    });
    return request;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const updated_role = await this.prisma.role.update({
      where: {
        id: id,
      },
      data: {
        name: updateRoleDto.name,
      },
    });
    return updated_role;
  }

  async remove(id: number) {
    const removed_role = await this.prisma.role.delete({
      where: {
        id: id,
      },
    });
    return removed_role;
  }
}
