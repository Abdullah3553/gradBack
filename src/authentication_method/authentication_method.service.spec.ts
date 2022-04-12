import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationMethodService } from './authentication_method.service';

describe('AuthenticationMethodService', () => {
  let service: AuthenticationMethodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthenticationMethodService],
    }).compile();

    service = module.get<AuthenticationMethodService>(AuthenticationMethodService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
