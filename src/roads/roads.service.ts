import { Injectable } from '@nestjs/common';
import { CreateRoadDto } from './dto/create-roads.dto';
import { UpdateRoadDto } from './dto/update-roads.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RoadEntity } from './entities/roads.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoadsService {
  constructor(
    @InjectRepository(RoadEntity)
    private roadsRepository: Repository<RoadEntity>,
  ) {}
  async create(createRoadDto: CreateRoadDto) {
    const user = await this.roadsRepository.create(createRoadDto);
    await this.roadsRepository.save(createRoadDto);
    return user;
  }

  async findAll() {
    return await this.roadsRepository.find();
  }

  async findOne(id: number) {
    return await this.roadsRepository.findOne({ where: { id: id } });
  }

  async update(id: number, updateRoadDto: UpdateRoadDto) {
    await this.roadsRepository.update({ id }, updateRoadDto);
    return await this.roadsRepository.findOne({ where: { id: id } });
  }

  async remove(id: number) {
    await this.roadsRepository.delete({ id });
    return { deleted: true };
  }

  async findAllBySearch(query: string): Promise<RoadEntity[]> {
    return this.roadsRepository
      .createQueryBuilder('roads')
      .where('roads.road_name LIKE :query', {
        query: `%${query}%`,
      })
      .getMany();
  }
}
