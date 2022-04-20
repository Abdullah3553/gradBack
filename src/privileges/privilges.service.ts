import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePrivilegeDto } from './dto/create-privilege.dto';
import { UpdatePriviledgeDto } from './dto/update-priviledge.dto';

@Injectable()
export class PrivilegesService {
  constructor(private prisma: PrismaService) {}

  async create(createPrivilegeDto: CreatePrivilegeDto) {
    const roles = createPrivilegeDto.roles?.map(( role) => ({
      id:role,
    }));
    return await this.prisma.privilege.create({
      data: {
        name: createPrivilegeDto.name,
        read: createPrivilegeDto.read,
        write: createPrivilegeDto.write,
        roles: {
          connect: roles,
        },
      },
      include:{
        roles:true
      }
    });
  }
  async findAll() {
    return await this.prisma.privilege.findMany({
      include:{
        roles:true
      }
    });
  }

  async findOne(id: number) {
    const request = await this.prisma.privilege.findUnique({
      where: {
        id: id,
      },
      include:{
        roles:true
      }
    });
    return request;
  }

  async findAllByRoleId(roleId:number){
    const privileges = await this.prisma.privilege.findMany({
      where:{
        roles:{
          some:{
            id:roleId
          }
        }
      }
    })

    return privileges
  }

  async update(id: number, updatePrivilegeDto: UpdatePriviledgeDto) {
    const roles = updatePrivilegeDto.roles?.map(( role) => ({
      id:role,
    }));
    const updated_privilege = await this.prisma.privilege.update({
      where: {
        id: id,
      },
      data: {
        name: updatePrivilegeDto.name,
        read: updatePrivilegeDto.read,
        write: updatePrivilegeDto.write,
        roles:{
          connect:roles
        }
      },
      include:{
        roles:true
      }
    });
    return updated_privilege;
  }

  async remove(id: number) {
    const removed_privileges = await this.prisma.privilege.delete({
      where: {
        id: id,
      },
      include:{
        roles:true
      }
    });
    return removed_privileges;
  }
}
