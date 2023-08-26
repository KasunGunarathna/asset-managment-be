import { Test, TestingModule } from '@nestjs/testing';
import { RoadsService } from './roads.service';

describe('RoadsService', () => {
  let service: RoadsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoadsService],
    }).compile();

    service = module.get<RoadsService>(RoadsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
