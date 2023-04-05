import { Test, TestingModule } from '@nestjs/testing';
import { StatusOrderController } from './status-order.controller';

describe('StatusOrderController', () => {
  let controller: StatusOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusOrderController],
    }).compile();

    controller = module.get<StatusOrderController>(StatusOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
