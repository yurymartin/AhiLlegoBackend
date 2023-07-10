import { Test, TestingModule } from '@nestjs/testing';
import { DistanceAmountService } from './distance-amount.service';

describe('DistanceAmountService', () => {
  let service: DistanceAmountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DistanceAmountService],
    }).compile();

    service = module.get<DistanceAmountService>(DistanceAmountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
