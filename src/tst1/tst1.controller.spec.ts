import { Test, TestingModule } from '@nestjs/testing';
import { Tst1Controller } from './tst1.controller';
import { Tst1Service } from './tst1.service';

describe('Tst1Controller', () => {
  let controller: Tst1Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Tst1Controller],
      providers: [Tst1Service],
    }).compile();

    controller = module.get<Tst1Controller>(Tst1Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
