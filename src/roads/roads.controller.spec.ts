import { Test, TestingModule } from '@nestjs/testing';
import { BridgesController } from './roads.controller';
import { BridgesService } from './roads.service';

describe('BridgesController', () => {
  let controller: BridgesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BridgesController],
      providers: [BridgesService],
    }).compile();

    controller = module.get<BridgesController>(BridgesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
