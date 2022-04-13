import { Test, TestingModule } from '@nestjs/testing';
import { PriviledgesService } from './privilges.service';

describe('PriviledgesService', () => {
  let service: PriviledgesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PriviledgesService],
    }).compile();

    service = module.get<PriviledgesService>(PriviledgesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
