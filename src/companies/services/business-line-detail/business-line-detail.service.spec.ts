import { Test, TestingModule } from '@nestjs/testing';
import { BusinessLineDetailService } from './business-line-detail.service';

describe('BusinessLineDetailService', () => {
  let service: BusinessLineDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessLineDetailService],
    }).compile();

    service = module.get<BusinessLineDetailService>(BusinessLineDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
