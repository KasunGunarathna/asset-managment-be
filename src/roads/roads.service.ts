import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoadDto } from './dto/create-roads.dto';
import { UpdateRoadDto } from './dto/update-roads.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RoadEntity } from './entities/roads.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs/promises';
import * as fs2 from 'fs';
import { parse } from 'csv-parse';
@Injectable()
export class RoadsService {
  constructor(
    @InjectRepository(RoadEntity)
    private roadsRepository: Repository<RoadEntity>,
  ) {}
  async create(createRoadDto: CreateRoadDto) {
    return await this.roadsRepository.save(createRoadDto);
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

  async parseCsv(filePath: string): Promise<any[]> {
    const results: CreateRoadDto[] = [];

    await new Promise<CreateRoadDto[]>((resolve, reject) => {
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

  async processBridges(data: CreateRoadDto[], filePath: any) {
    const roadsToSave: CreateRoadDto[] = data.map((roadDto) => {
      const road = new CreateRoadDto();
      road.road_name = roadDto.road_name;
      road.length = roadDto.length;
      road.width = roadDto.width;
      road.gazetted_detail = roadDto.gazetted_detail;
      road.survey_plan = roadDto.survey_plan;
      road.surface_condition = roadDto.surface_condition;
      road.pavement_type = roadDto.pavement_type;
      road.starting_point_location = roadDto.starting_point_location;
      road.end_point_location = roadDto.end_point_location;
      road.drainage_availability = roadDto.drainage_availability;
      return road;
    });

    try {
      fs2.unlinkSync(filePath);
      // Use TypeORM repository to insert the records in bulk
      return await this.roadsRepository.insert(roadsToSave);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateImage(
    id: number,
    imageUrl: string,
    photo: any,
  ): Promise<RoadEntity> {
    const light = await this.roadsRepository.findOne({
      where: { id: id },
    });
    if (!light) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    if (photo == 1) light.starting_point_photo = imageUrl;
    if (photo == 2) light.end_point_photo = imageUrl;
    await this.roadsRepository.update({ id }, light);

    return light;
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
