import { Test, TestingModule } from '@nestjs/testing';
import { DrainagesService } from './Drainages.service';

describe('DrainagesService', () => {
  let service: DrainagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DrainagesService],
    }).compile();

    service = module.get<DrainagesService>(DrainagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
