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
    private RoadsRepository: Repository<RoadEntity>,
  ) {}
  async create(createRoadDto: CreateRoadDto) {
    const user = await this.RoadsRepository.create(createRoadDto);
    await this.RoadsRepository.save(createRoadDto);
    return user;
  }

  async findAll() {
    return await this.RoadsRepository.find();
  }

  async findOne(id: number) {
    return await this.RoadsRepository.findOne({ where: { id: id } });
  }

  async update(id: number, updateRoadDto: UpdateRoadDto) {
    await this.RoadsRepository.update({ id }, updateRoadDto);
    return await this.RoadsRepository.findOne({ where: { id: id } });
  }

  async remove(id: number) {
    await this.RoadsRepository.delete({ id });
    return { deleted: true };
  }
}
