import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePriviledgeDto } from './dto/create-priviledge.dto';
import { UpdatePriviledgeDto } from './dto/update-priviledge.dto';

@Injectable()
export class PrivilegesService {
  constructor(private prisma: PrismaService) {}

  async create(createPriviledgeDto: CreatePriviledgeDto) {
    const roles = createPriviledgeDto.roles?.map(( role) => ({
      id:role,
    }));
    return await this.prisma.privilege.create({
      data: {
        name: createPriviledgeDto.name,
        read: createPriviledgeDto.read,
        write: createPriviledgeDto.write,
        roles: {
          connect: roles,
        },
      },
    });
  }
  async findAll() {
    return await this.prisma.privilege.findMany();
  }

  async findOne(id: number) {
    const request = await this.prisma.privilege.findUnique({
      where: {
        id: id,
      },
    });
    return request;
  }

  async update(id: number, updatePriviledgeDto: UpdatePriviledgeDto) {
    const updated_privilege = await this.prisma.privilege.update({
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
    const removed_privileges = await this.prisma.privilege.delete({
      where: {
        id: id,
      },
    });
    return removed_privileges;
  }
}
