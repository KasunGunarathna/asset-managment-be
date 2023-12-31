import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDrainageDto } from './dto/create-drainages.dto';
import { UpdateDrainageDto } from './dto/update-drainages.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DrainageEntity } from './entities/drainages.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs/promises';
import * as fs2 from 'fs';
import { parse } from 'csv-parse';

@Injectable()
export class DrainagesService {
  constructor(
    @InjectRepository(DrainageEntity)
    private drainagesRepository: Repository<DrainageEntity>,
  ) {}
  async create(createDrainageDto: CreateDrainageDto) {
    return await this.drainagesRepository.save(createDrainageDto);
  }

  async findAll() {
    return this.drainagesRepository
      .createQueryBuilder('drainage')
      .orderBy('drainage.updatedAt', 'DESC')
      .getMany();
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

  async findAllBySearch(
    search: string,
    f1name: string,
    f1value: string,
    f2name: string,
    f2value: string,
  ): Promise<DrainageEntity[]> {
    let where = '';
    let searchQuery = '';
    if (f1value) where = ` drainage.${f1name}='${f1value}'`;
    if (f2value) where = ` drainage.${f2name}='${f2value}'`;
    if (f1value && f2value)
      where = ` (drainage.${f1name}='${f1value}' AND drainage.${f2name}='${f2value}')`;
    if (search) searchQuery = `drainage.road_name LIKE '%${search}%'`;
    if (search && (f1value || f2value))
      searchQuery = `(drainage.road_name LIKE '%${search}%'  AND`;
    return this.drainagesRepository
      .createQueryBuilder('drainage')
      .where(`${searchQuery} ${where}`)
      .orderBy('drainage.updatedAt', 'DESC')
      .getMany();
  }

  async parseCsv(filePath: string): Promise<any[]> {
    const results: CreateDrainageDto[] = [];

    await new Promise<CreateDrainageDto[]>((resolve, reject) => {
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

  async processDrainage(data: CreateDrainageDto[], filePath: any) {
    const drainageToSave: CreateDrainageDto[] = data.map((drainageDto) => {
      const drainage = new CreateDrainageDto();
      drainage.road_name = drainageDto.road_name;
      drainage.drainage_type = drainageDto.drainage_type;
      drainage.side_of_drain = drainageDto.side_of_drain;
      drainage.starting_point_location = drainageDto.starting_point_location;
      drainage.end_point_location = drainageDto.end_point_location;
      drainage.condition = drainageDto.condition;
      drainage.length = drainageDto.length;
      drainage.width = drainageDto.width;
      return drainage;
    });

    try {
      fs2.unlinkSync(filePath);

      return await this.drainagesRepository.insert(drainageToSave);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
