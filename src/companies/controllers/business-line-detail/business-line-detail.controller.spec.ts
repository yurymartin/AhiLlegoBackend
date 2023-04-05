import { Test, TestingModule } from '@nestjs/testing';
import { BusinessLineDetailController } from './business-line-detail.controller';

describe('BusinessLineDetailController', () => {
  let controller: BusinessLineDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessLineDetailController],
    }).compile();

    controller = module.get<BusinessLineDetailController>(BusinessLineDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
