import { Test, TestingModule } from '@nestjs/testing';
import { StreetService } from './street.service';

describe('StreetService', () => {
  let service: StreetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StreetService],
    }).compile();

    service = module.get<StreetService>(StreetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
