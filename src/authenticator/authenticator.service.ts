import { Injectable } from '@nestjs/common';
import { CreateAuthenticatorDto } from './dto/create-authenticator.dto';
import { UpdateAuthenticatorDto } from './dto/update-authenticator.dto';

@Injectable()
export class AuthenticatorService {
  create(createAuthenticatorDto: CreateAuthenticatorDto) {
    return 'This action adds a new authenticator';
  }

  findAll() {
    return `This action returns all authenticator`;
  }

  findOne(id: number) {
    return `This action returns a #${id} authenticator`;
  }

  update(id: number, updateAuthenticatorDto: UpdateAuthenticatorDto) {
    return `This action updates a #${id} authenticator`;
  }

  remove(id: number) {
    return `This action removes a #${id} authenticator`;
  }
}
