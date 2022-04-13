import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePriviledgeDto } from './dto/create-priviledge.dto';
import { UpdatePriviledgeDto } from './dto/update-priviledge.dto';

@Injectable()
export class PrivilegesService {
  constructor(private prisma: PrismaService) {}

  create(createPriviledgeDto: CreatePriviledgeDto) {
    return this.prisma.privileges.create({
      data: {
        name: createPriviledgeDto.name,
        read: createPriviledgeDto.read,
        write: createPriviledgeDto.write,
      },
    });
  }
  findAll() {
    return `This action returns all priviledges`;
  }

  findOne(id: number) {
    return `This action returns a #${id} priviledge`;
  }

  update(id: number, updatePriviledgeDto: UpdatePriviledgeDto) {
    return `This action updates a #${id} priviledge`;
  }

  remove(id: number) {
    return `This action removes a #${id} priviledge`;
  }
}
