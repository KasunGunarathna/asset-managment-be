import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStreetLightDto } from './dto/create-street_lights.dto';
import { UpdateStreetLightDto } from './dto/update-street_lights.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StreetLightEntity } from './entities/street_lights.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs/promises';
import * as fs2 from 'fs';
import { parse } from 'csv-parse';

@Injectable()
export class StreetLightsService {
  constructor(
    @InjectRepository(StreetLightEntity)
    private streetLightsRepository: Repository<StreetLightEntity>,
  ) {}
  async create(createStreetLightDto: CreateStreetLightDto) {
    const light = await this.streetLightsRepository.save(createStreetLightDto);
    return light;
  }

  async findAll() {
    return this.streetLightsRepository
      .createQueryBuilder('street_lights')
      .orderBy('street_lights.updatedAt', 'DESC')
      .getMany();
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

  async findAllBySearch(
    search: string,
    f1name: string,
    f1value: string,
    f2name: string,
    f2value: string,
  ): Promise<StreetLightEntity[]> {
    let where = '';
    let searchQuery = '';
    if (f1value) where = ` street_lights.${f1name}='${f1value}'`;
    if (f2value) where = ` street_lights.${f2name}='${f2value}'`;
    if (f1value && f2value)
      where = ` (street_lights.${f1name}='${f1value}' AND street_lights.${f2name}='${f2value}')`;
    if (search)
      searchQuery = `street_lights.road_name LIKE '%${search}%' OR street_lights.pole_number LIKE '%${search}%'`;
    if (search && (f1value || f2value))
      searchQuery = `(street_lights.road_name LIKE '%${search}%' OR street_lights.pole_number LIKE '%${search}%' AND`;
    console.log(`${searchQuery} ${where}`);
    return this.streetLightsRepository
      .createQueryBuilder('street_lights')
      .where(`${searchQuery} ${where}`)
      .orderBy('street_lights.updatedAt', 'DESC')
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

  async parseCsv(filePath: string): Promise<any[]> {
    const results: CreateStreetLightDto[] = [];

    await new Promise<CreateStreetLightDto[]>((resolve, reject) => {
      const parser = parse({
        delimiter: ',',
        columns: true, // Treat the first row as column headers
        skip_empty_lines: true,
      });

      const readStream = fs2.createReadStream(filePath);

      readStream.pipe(parser);

      parser.on('readable', () => {
        let record;
        while ((record = parser.read()) !== null) {
          results.push(record);
        }
      });

      parser.on('error', function (err) {
        console.error(err.message);
        reject(err);
      });
      parser.on('end', function () {
        resolve(results);
      });
    });
    return results;
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

  async processStreetLights(data: CreateStreetLightDto[], filePath: any) {
    const streetLightsToSave = data.map((streetLightDto) => {
      const streetLight = new CreateStreetLightDto();
      streetLight.pole_number = streetLightDto.pole_number;
      streetLight.road_name = streetLightDto.road_name;
      streetLight.wire_condition = streetLightDto.wire_condition;
      streetLight.switch_condition = streetLightDto.switch_condition;
      streetLight.pole_type = streetLightDto.pole_type;
      streetLight.lamp_type = streetLightDto.lamp_type;
      return streetLight;
    });

    try {
      fs2.unlinkSync(filePath);
      // Use TypeORM repository to insert the records in bulk
      return await this.streetLightsRepository.insert(streetLightsToSave);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async readProfileImage(imagePath: string): Promise<fs2.ReadStream> {
    try {
      if (!fs2.existsSync(imagePath)) {
        throw new NotFoundException('Light image not found');
      }
      const imageStream = fs2.createReadStream(imagePath);
      return imageStream;
    } catch (error) {
      throw new NotFoundException('Light image not found');
    }
  }
}
