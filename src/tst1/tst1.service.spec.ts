import { Test, TestingModule } from '@nestjs/testing';
import { Tst1Service } from './tst1.service';

describe('Tst1Service', () => {
  let service: Tst1Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Tst1Service],
    }).compile();

    service = module.get<Tst1Service>(Tst1Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
