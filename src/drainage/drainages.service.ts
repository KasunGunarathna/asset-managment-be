import { Injectable } from '@nestjs/common';
import { CreateDrainageDto } from './dto/create-drainages.dto';
import { UpdateDrainageDto } from './dto/update-drainages.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DrainageEntity } from './entities/drainages.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DrainagesService {
  constructor(
    @InjectRepository(DrainageEntity)
    private drainagesRepository: Repository<DrainageEntity>,
  ) {}
  async create(createDrainageDto: CreateDrainageDto) {
    const user = await this.drainagesRepository.create(createDrainageDto);
    await this.drainagesRepository.save(createDrainageDto);
    return user;
  }

  async findAll() {
    return await this.drainagesRepository.find();
  }

  async findOne(id: number) {
    return await this.drainagesRepository.findOne({ where: { id: id } });
  }

  async update(id: number, updateDrainageDto: UpdateDrainageDto) {
    await this.drainagesRepository.update({ id }, updateDrainageDto);
    return await this.drainagesRepository.findOne({ where: { id: id } });
  }

  async remove(id: number) {
    await this.drainagesRepository.delete({ id });
    return { deleted: true };
  }

  async findAllBySearch(query: string): Promise<DrainageEntity[]> {
    return this.drainagesRepository
      .createQueryBuilder('drainage')
      .where('drainage.road_name LIKE :query', {
        query: `%${query}%`,
      })
      .getMany();
  }
}
