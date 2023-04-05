import { Test, TestingModule } from '@nestjs/testing';
import { TypeAddressController } from './type-address.controller';

describe('TypeAddressController', () => {
  let controller: TypeAddressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeAddressController],
    }).compile();

    controller = module.get<TypeAddressController>(TypeAddressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
