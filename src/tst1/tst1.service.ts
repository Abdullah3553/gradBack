import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateTst1Dto } from './dto/create-tst1.dto';
import { UpdateTst1Dto } from './dto/update-tst1.dto';
import { Tst1 } from './entities/tst1.entity';

@Injectable()
export class Tst1Service {
  constructor(readonly dbConnection: Repository<Tst1>){}
  create(createTst1Dto: CreateTst1Dto) {
    return 'This action adds a new tst1';
  }

  findAll() {
    return `This action returns all tst1`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tst1`;
  }

  update(id: number, updateTst1Dto: UpdateTst1Dto) {
    return `This action updates a #${id} tst1`;
  }

  remove(id: number) {
    return `This action removes a #${id} tst1`;
  }
}
