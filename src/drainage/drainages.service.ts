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

  async parseCsv(filePath: string): Promise<any[]> {
    const results: CreateDrainageDto[] = [];

    await new Promise<CreateDrainageDto[]>((resolve, reject) => {
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
        resolve(results);
      });

      parser.on('error', function (err) {
        console.error(err.message);
        reject(err);
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
      drainage.starting_point_latitude = drainageDto.starting_point_latitude;
      drainage.starting_point_longitude = drainageDto.starting_point_longitude;
      drainage.end_point_latitude = drainageDto.end_point_latitude;
      drainage.end_point_longitude = drainageDto.end_point_longitude;
      drainage.condition = drainageDto.condition;
      drainage.length = drainageDto.length;
      drainage.width = drainageDto.width;
      return drainage;
    });

    try {
      fs2.unlinkSync(filePath);
      // Use TypeORM repository to insert the records in bulk
      return await this.drainagesRepository.insert(drainageToSave);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
