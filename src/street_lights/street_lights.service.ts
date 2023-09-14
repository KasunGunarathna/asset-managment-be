import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStreetLightDto } from './dto/create-street_lights.dto';
import { UpdateStreetLightDto } from './dto/update-street_lights.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StreetLightEntity } from './entities/street_lights.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs/promises';
import * as fs2 from 'fs';

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

  async findAllBySearch(query: string): Promise<StreetLightEntity[]> {
    return this.streetLightsRepository
      .createQueryBuilder('street_lights')
      .where(
        'street_lights.road_name LIKE :query OR street_lights.pole_number LIKE :query',
        {
          query: `%${query}%`,
        },
      )
      .getMany();
  }

  async updateImage(id: number, imageUrl: string): Promise<StreetLightEntity> {
    const light = await this.streetLightsRepository.findOne({
      where: { id: id },
    });
    if (!light) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    light.photo = imageUrl;
    await this.streetLightsRepository.update({ id }, light);

    return light;
  }

  async saveFileLocally(
    uniqueFileName: string,
    fileBuffer: Buffer,
  ): Promise<string> {
    const uploadDirectory = './uploads';
    const filePath = `${uploadDirectory}/${uniqueFileName}`;
    await fs.writeFile(filePath, fileBuffer);
    return filePath;
  }

  async readProfileImage(imagePath: string): Promise<fs2.ReadStream> {
    try {
      const imageStream = fs2.createReadStream(imagePath);
      return imageStream;
    } catch (error) {
      throw new NotFoundException('Road image not found');
    }
  }
}
