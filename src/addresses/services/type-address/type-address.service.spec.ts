import { Test, TestingModule } from '@nestjs/testing';
import { TypeAddressService } from './type-address.service';

describe('TypeAddressService', () => {
  let service: TypeAddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeAddressService],
    }).compile();

    service = module.get<TypeAddressService>(TypeAddressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
