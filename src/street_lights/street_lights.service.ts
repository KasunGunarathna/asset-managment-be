import { Injectable } from '@nestjs/common';
import { CreateStreetLightDto } from './dto/create-street_lights.dto';
import { UpdateStreetLightDto } from './dto/update-street_lights.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StreetLightEntity } from './entities/street_lights.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StreetLightsService {
  constructor(
    @InjectRepository(StreetLightEntity)
    private streetLightsRepository: Repository<StreetLightEntity>,
  ) {}
  async create(createStreetLightDto: CreateStreetLightDto) {
    const user = await this.streetLightsRepository.create(createStreetLightDto);
    await this.streetLightsRepository.save(createStreetLightDto);
    return user;
  }

  async findAll() {
    return await this.streetLightsRepository.find();
  }

  async findOne(id: number) {
    return await this.streetLightsRepository.findOne({ where: { id: id } });
  }

  async update(id: number, updateStreetLightDto: UpdateStreetLightDto) {
    await this.streetLightsRepository.update({ id }, updateStreetLightDto);
    return await this.streetLightsRepository.findOne({ where: { id: id } });
  }

  async remove(id: number) {
    await this.streetLightsRepository.delete({ id });
    return { deleted: true };
  }
}
