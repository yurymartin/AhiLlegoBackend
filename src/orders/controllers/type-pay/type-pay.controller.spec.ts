import { Test, TestingModule } from '@nestjs/testing';
import { TypePayController } from './type-pay.controller';

describe('TypePayController', () => {
  let controller: TypePayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypePayController],
    }).compile();

    controller = module.get<TypePayController>(TypePayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
