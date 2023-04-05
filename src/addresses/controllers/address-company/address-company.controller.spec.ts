import { Test, TestingModule } from '@nestjs/testing';
import { AddressCompanyController } from './address-company.controller';

describe('AddressCompanyController', () => {
  let controller: AddressCompanyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressCompanyController],
    }).compile();

    controller = module.get<AddressCompanyController>(AddressCompanyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
