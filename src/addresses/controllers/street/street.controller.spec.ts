import { Test, TestingModule } from '@nestjs/testing';
import { StreetController } from './street.controller';

describe('StreetController', () => {
  let controller: StreetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StreetController],
    }).compile();

    controller = module.get<StreetController>(StreetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
