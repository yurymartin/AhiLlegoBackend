import { Test, TestingModule } from '@nestjs/testing';
import { DistanceAmountController } from './distance-amount.controller';

describe('DistanceAmountController', () => {
  let controller: DistanceAmountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DistanceAmountController],
    }).compile();

    controller = module.get<DistanceAmountController>(DistanceAmountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
