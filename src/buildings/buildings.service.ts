import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BuildingsEntity } from './entities/buildings.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs/promises';
import * as fs2 from 'fs';
import { parse } from 'csv-parse';

@Injectable()
export class BuildingsService {
  constructor(
    @InjectRepository(BuildingsEntity)
    private buildingsRepository: Repository<BuildingsEntity>,
  ) {}

  async create(createBuildingDto: CreateBuildingDto) {
    return await this.buildingsRepository.save(createBuildingDto);
  }

  async findAll() {
    return await this.buildingsRepository
      .createQueryBuilder('buildings')
      .orderBy('buildings.updatedAt', 'DESC')
      .getMany();
  }

  async findOne(id: number) {
    return await this.buildingsRepository.findOne({ where: { id: id } });
  }

  async update(id: number, updateBuildingDto: UpdateBuildingDto) {
    await this.buildingsRepository.update({ id }, updateBuildingDto);
    return await this.buildingsRepository.findOne({ where: { id: id } });
  }

  async remove(id: number) {
    await this.buildingsRepository.delete({ id });
    return { deleted: true };
  }

  async findAllBySearch(
    search: string,
    f1name: string,
    f1value: string,
    f2name: string,
    f2value: string,
  ): Promise<BuildingsEntity[]> {
    let where = '';
    let searchQuery = '';
    if (f1value) where = ` buildings.${f1name}='${f1value}'`;
    if (f2value) where = ` buildings.${f2name}='${f2value}'`;
    if (f1value && f2value)
      where = ` (buildings.${f1name}='${f1value}' AND buildings.${f2name}='${f2value}')`;
    if (search)
      searchQuery = `buildings.name LIKE '%${search}%' OR buildings.plan LIKE '%${search}%'`;
    if (search && (f1value || f2value))
      searchQuery = `(buildings.name LIKE '%${search}%' OR buildings.plan LIKE '%${search}%') AND`;
    return this.buildingsRepository
      .createQueryBuilder('buildings')
      .where(`${searchQuery} ${where}`)
      .orderBy('buildings.updatedAt', 'DESC')
      .getMany();
  }

  async parseCsv(filePath: string): Promise<any[]> {
    const results: CreateBuildingDto[] = [];

    await new Promise((resolve, reject) => {
      const parser = parse({
        delimiter: ',',
        columns: true,
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

  async updateImage(id: number, imageUrl: string): Promise<BuildingsEntity> {
    const light = await this.buildingsRepository.findOne({
      where: { id: id },
    });
    if (!light) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    light.photo = imageUrl;
    await this.buildingsRepository.update({ id }, light);

    return light;
  }

  async processBuildings(data: CreateBuildingDto[], filePath: any) {
    const buildingsToSave: CreateBuildingDto[] = data.map((buildingDto) => {
      const building = new CreateBuildingDto();
      building.name = buildingDto.name;
      building.plan = buildingDto.plan;
      building.number_of_stories = buildingDto.number_of_stories;
      building.photo = buildingDto.photo;
      building.location = buildingDto.location;
      building.built_year = buildingDto.built_year;
      building.condition = buildingDto.condition;
      building.remark = buildingDto.remark;
      return building;
    });

    try {
      fs2.unlinkSync(filePath);

      return await this.buildingsRepository.save(buildingsToSave);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async readProfileImage(imagePath: string): Promise<fs2.ReadStream> {
    try {
      if (!fs2.existsSync(imagePath)) {
        throw new NotFoundException('Building image not found');
      }
      const imageStream = fs2.createReadStream(imagePath);
      return imageStream;
    } catch (error) {
      throw new NotFoundException('Building image not found');
    }
  }
}
