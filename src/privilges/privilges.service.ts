import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePriviledgeDto } from './dto/create-priviledge.dto';
import { UpdatePriviledgeDto } from './dto/update-priviledge.dto';

@Injectable()
export class PrivilegesService {
  constructor(private prisma: PrismaService) {}

  async create(createPriviledgeDto: CreatePriviledgeDto) {
    return await this.prisma.privileges.create({
      data: {
        name: createPriviledgeDto.name,
        read: createPriviledgeDto.read,
        write: createPriviledgeDto.write,
      },
    });
  }
  async findAll() {
    return await this.prisma.privileges.findMany();
  }

  async findOne(id: number) {
    const request = await this.prisma.privileges.findUnique({
      where: {
        id: id,
      },
    });
    return request;
  }

  async update(id: number, updatePriviledgeDto: UpdatePriviledgeDto) {
    const updated_privilege = await this.prisma.privileges.update({
      where: {
        id: id,
      },
      data: {
        name: updatePriviledgeDto.name,
        read: updatePriviledgeDto.read,
        write: updatePriviledgeDto.write,
      },
    });
    return updated_privilege;
  }

  async remove(id: number) {
    const removed_privileges = await this.prisma.privileges.delete({
      where: {
        id: id,
      },
    });
    return removed_privileges;
  }
}
