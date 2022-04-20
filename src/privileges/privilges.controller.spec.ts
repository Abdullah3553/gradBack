import { Test, TestingModule } from '@nestjs/testing';
import { PriviledgesController } from './privileges.controller';
import { PriviledgesService } from './privilges.service';

describe('PriviledgesController', () => {
  let controller: PriviledgesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PriviledgesController],
      providers: [PriviledgesService],
    }).compile();

    controller = module.get<PriviledgesController>(PriviledgesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
