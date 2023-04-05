import { Test, TestingModule } from '@nestjs/testing';
import { StreetAmountService } from './street-amount.service';

describe('StreetAmountService', () => {
  let service: StreetAmountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StreetAmountService],
    }).compile();

    service = module.get<StreetAmountService>(StreetAmountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
