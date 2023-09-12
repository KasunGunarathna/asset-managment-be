import { Injectable } from '@nestjs/common';
import { CreateBridgeDto } from './dto/create-bridge.dto';
import { UpdateBridgeDto } from './dto/update-bridge.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BridgesEntity } from './entities/bridge.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BridgesService {
  constructor(
    @InjectRepository(BridgesEntity)
    private bridgesRepository: Repository<BridgesEntity>,
  ) {}
  async create(createBridgeDto: CreateBridgeDto) {
    const user = await this.bridgesRepository.create(createBridgeDto);
    await this.bridgesRepository.save(createBridgeDto);
    return user;
  }

  async findAll() {
    return await this.bridgesRepository.find();
  }

  async findOne(id: number) {
    return await this.bridgesRepository.findOne({ where: { id: id } });
  }

  async update(id: number, updateBridgeDto: UpdateBridgeDto) {
    await this.bridgesRepository.update({ id }, updateBridgeDto);
    return await this.bridgesRepository.findOne({ where: { id: id } });
  }

  async remove(id: number) {
    await this.bridgesRepository.delete({ id });
    return { deleted: true };
  }

  async findAllBySearch(query: string): Promise<BridgesEntity[]> {
    return this.bridgesRepository
      .createQueryBuilder('bridges')
      .where(
        'bridges.bridge_name LIKE :query OR bridges.road_name LIKE :query',
        {
          query: `%${query}%`,
        },
      )
      .getMany();
  }
}
