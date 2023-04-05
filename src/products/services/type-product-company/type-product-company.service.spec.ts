import { Test, TestingModule } from '@nestjs/testing';
import { TypeProductCompanyService } from './type-product-company.service';

describe('TypeProductCompanyService', () => {
  let service: TypeProductCompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeProductCompanyService],
    }).compile();

    service = module.get<TypeProductCompanyService>(TypeProductCompanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
