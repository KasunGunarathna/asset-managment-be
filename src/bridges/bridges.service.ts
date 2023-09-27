import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBridgeDto } from './dto/create-bridge.dto';
import { UpdateBridgeDto } from './dto/update-bridge.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BridgesEntity } from './entities/bridge.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs/promises';
import * as fs2 from 'fs';
import { parse } from 'csv-parse';

@Injectable()
export class BridgesService {
  constructor(
    @InjectRepository(BridgesEntity)
    private bridgesRepository: Repository<BridgesEntity>,
  ) {}
  async create(createBridgeDto: CreateBridgeDto) {
    return await this.bridgesRepository.save(createBridgeDto);
  }

  async findAll() {
    return await this.bridgesRepository
      .createQueryBuilder('bridges')
      .orderBy('bridges.updatedAt', 'DESC')
      .getMany();
  }

  async findOne(id: number) {
    return await this.bridgesRepository.findOne({ where: { id: id } });
  }

  async update(id: number, updateBridgeDto: UpdateBridgeDto) {
    await this.bridgesRepository.update({ id }, updateBridgeDto);
    return await this.bridgesRepository.findOne({ where: { id: id } });
  }

  async remove(id: number) {
    await this.bridgesRepository.delete({ id });
    return { deleted: true };
  }

  async findAllBySearch(
    search: string,
    f1name: string,
    f1value: string,
    f2name: string,
    f2value: string,
  ): Promise<BridgesEntity[]> {
    let where = '';
    let searchQuery = '';
    if (f1value) where = ` bridges.${f1name}='${f1value}'`;
    if (f2value) where = ` bridges.${f2name}='${f2value}'`;
    if (f1value && f2value)
      where = ` (bridges.${f1name}='${f1value}' AND bridges.${f2name}='${f2value}')`;
    if (search)
      searchQuery = `bridges.bridge_name LIKE '%${search}%' OR bridges.road_name LIKE '%${search}%'`;
    if (search && (f1value || f2value))
      searchQuery = `(bridges.bridge_name LIKE '%${search}%' OR bridges.road_name LIKE '%${search}%') AND`;
    return this.bridgesRepository
      .createQueryBuilder('bridges')
      .where(`${searchQuery} ${where}`)
      .orderBy('bridges.updatedAt', 'DESC')
      .getMany();
  }

  async parseCsv(filePath: string): Promise<any[]> {
    const results: CreateBridgeDto[] = [];

    await new Promise((resolve, reject) => {
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

  async processBridges(data: CreateBridgeDto[], filePath: any) {
    const bridgesToSave: CreateBridgeDto[] = data.map((bridgeDto) => {
      const bridge = new CreateBridgeDto();
      bridge.bridge_name = bridgeDto.bridge_name;
      bridge.road_name = bridgeDto.road_name;
      bridge.location = bridgeDto.location;
      bridge.length = bridgeDto.length;
      bridge.width = bridgeDto.width;
      bridge.structure_condition = bridgeDto.structure_condition;
      bridge.road_surface_condition = bridgeDto.road_surface_condition;
      bridge.remarks = bridgeDto.remarks;
      return bridge;
    });

    try {
      fs2.unlinkSync(filePath);
      // Use TypeORM repository to insert the records in bulk
      return await this.bridgesRepository.save(bridgesToSave);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
