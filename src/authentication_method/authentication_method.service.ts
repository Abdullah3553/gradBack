import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuthenticationMethodDto } from './dto/create-authentication_method.dto';
import { UpdateAuthenticationMethodDto } from './dto/update-authentication_method.dto';

@Injectable()
export class AuthenticationMethodService {
  constructor(private prisma: PrismaService) {}

  async create(request: CreateAuthenticationMethodDto) {
    // check for existence
    const chekcer = await this.findOneByTitle(request.title);
      if (chekcer) {
      throw new NotAcceptableException('This method exists already');
    }
    const response = await this.prisma.authentication_method.create({
      data: {
        title: request.title,
        file_path: request.file_path,
        revresable: request.revresable
      },
    });
    return response;
  }

  async findAllForGuest() {
    const methods = await this.prisma.authentication_method.findMany();
    return methods.map(method => {
      return{id:method.id, method:method.title}
    })
  }

  async findAll() {
    return await this.prisma.authentication_method.findMany();
  }

  async findOne(id: number) {
    const request = await this.prisma.authentication_method.findUnique({
      where: {
        id: id,
      },
    });
    return request;
  }

  async findOneByTitle(title: string) {
    const request = await this.prisma.authentication_method.findUnique({
      where: {
        title: title,
      },
    });
    return request;
  }

  async update(
    id: number,
    updateAuthenticationMethodDto: UpdateAuthenticationMethodDto,
  ) {
    const checker = await this.prisma.authentication_method.findUnique({
      where: {
        title: updateAuthenticationMethodDto.title,id
      },
    });
    if (checker.id && checker.id != id) {
      throw new NotAcceptableException('Repeated Authentication method');
    }

    const update_authentication =
      await this.prisma.authentication_method.update({
        where: {
          id: id,
        },
        data: {
          title: updateAuthenticationMethodDto.title,
          file_path: updateAuthenticationMethodDto.file_path,
          revresable: updateAuthenticationMethodDto.revresable
        },
      });
    return update_authentication;
  }

  async remove(id: number) {
    const delete_Auth = await this.prisma.authentication_method.delete({
      where: {
        id: id,
      },
    });
    return delete_Auth;
  }
}
