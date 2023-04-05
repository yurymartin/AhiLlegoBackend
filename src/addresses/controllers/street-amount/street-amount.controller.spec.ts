import { Test, TestingModule } from '@nestjs/testing';
import { StreetAmountController } from './street-amount.controller';

describe('StreetAmountController', () => {
  let controller: StreetAmountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StreetAmountController],
    }).compile();

    controller = module.get<StreetAmountController>(StreetAmountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
