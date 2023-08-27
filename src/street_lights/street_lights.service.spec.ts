import { Test, TestingModule } from '@nestjs/testing';
import { StreetLightsService } from './StreetLights.service';

describe('StreetLightsService', () => {
  let service: StreetLightsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StreetLightsService],
    }).compile();

    service = module.get<StreetLightsService>(StreetLightsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
