import { Test, TestingModule } from '@nestjs/testing';
import { BridgesController } from './vehicles.controller';
import { BridgesService } from './vehicles.service';

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
