import { Test, TestingModule } from '@nestjs/testing';
import { TypeProductCompanyController } from './type-product-company.controller';

describe('TypeProductCompanyController', () => {
  let controller: TypeProductCompanyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeProductCompanyController],
    }).compile();

    controller = module.get<TypeProductCompanyController>(TypeProductCompanyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
