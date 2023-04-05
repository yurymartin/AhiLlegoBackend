import { Test, TestingModule } from '@nestjs/testing';
import { TypePayService } from './type-pay.service';

describe('TypePayService', () => {
  let service: TypePayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypePayService],
    }).compile();

    service = module.get<TypePayService>(TypePayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
