import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationMethodController } from './authentication_method.controller';
import { AuthenticationMethodService } from './authentication_method.service';

describe('AuthenticationMethodController', () => {
  let controller: AuthenticationMethodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationMethodController],
      providers: [AuthenticationMethodService],
    }).compile();

    controller = module.get<AuthenticationMethodController>(AuthenticationMethodController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
