import { Test, TestingModule } from '@nestjs/testing';
import { AddressCompanyService } from './address-company.service';

describe('AddressCompanyService', () => {
  let service: AddressCompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddressCompanyService],
    }).compile();

    service = module.get<AddressCompanyService>(AddressCompanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
