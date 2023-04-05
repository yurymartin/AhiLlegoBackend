import { Test, TestingModule } from '@nestjs/testing';
import { StatusOrderService } from './status-order.service';

describe('StatusOrderService', () => {
  let service: StatusOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatusOrderService],
    }).compile();

    service = module.get<StatusOrderService>(StatusOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
