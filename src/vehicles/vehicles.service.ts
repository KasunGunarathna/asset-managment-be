import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { VehiclesEntity } from './entities/vehicle.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs/promises';
import * as fs2 from 'fs';
import { parse } from 'csv-parse';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(VehiclesEntity)
    private vehiclesRepository: Repository<VehiclesEntity>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto) {
    return await this.vehiclesRepository.save(createVehicleDto);
  }

  async findAll() {
    return await this.vehiclesRepository
      .createQueryBuilder('vehicles')
      .orderBy('vehicles.updatedAt', 'DESC')
      .getMany();
  }

  async findOne(id: number) {
    return await this.vehiclesRepository.findOne({ where: { id: id } });
  }

  async update(id: number, updateVehicleDto: UpdateVehicleDto) {
    await this.vehiclesRepository.update({ id }, updateVehicleDto);
    return await this.vehiclesRepository.findOne({ where: { id: id } });
  }

  async remove(id: number) {
    await this.vehiclesRepository.delete({ id });
    return { deleted: true };
  }

  async findAllBySearch(
    search: string,
    f1name: string,
    f1value: string,
    f2name: string,
    f2value: string,
  ): Promise<VehiclesEntity[]> {
    let where = '';
    let searchQuery = '';
    if (f1value) where = ` vehicles.${f1name}='${f1value}'`;
    if (f2value) where = ` vehicles.${f2name}='${f2value}'`;
    if (f1value && f2value)
      where = ` (vehicles.${f1name}='${f1value}' AND vehicles.${f2name}='${f2value}')`;
    if (search)
      searchQuery = `vehicles.vehicle_number LIKE '%${search}%' OR vehicles.model LIKE '%${search}%'`;
    if (search && (f1value || f2value))
      searchQuery = `(vehicles.vehicle_number LIKE '%${search}%' OR vehicles.model LIKE '%${search}%') AND`;
    return this.vehiclesRepository
      .createQueryBuilder('vehicles')
      .where(`${searchQuery} ${where}`)
      .orderBy('vehicles.updatedAt', 'DESC')
      .getMany();
  }

  async parseCsv(filePath: string): Promise<any[]> {
    const results: CreateVehicleDto[] = [];

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

  async processVehicles(data: CreateVehicleDto[], filePath: any) {
    const vehiclesToSave: CreateVehicleDto[] = data.map((vehicleDto) => {
      const vehicle = new CreateVehicleDto();
      vehicle.vehicle_number = vehicleDto.vehicle_number;
      vehicle.vehicle_make = vehicleDto.vehicle_make;
      vehicle.model = vehicleDto.model;
      vehicle.fuel_type = vehicleDto.fuel_type;
      vehicle.license_from = vehicleDto.license_from;
      vehicle.license_to = vehicleDto.license_to;
      vehicle.engine_number = vehicleDto.engine_number;
      vehicle.allocated_location = vehicleDto.allocated_location;
      vehicle.yom = vehicleDto.yom;
      vehicle.yor = vehicleDto.yor;
      vehicle.chassi_number = vehicleDto.chassi_number;
      vehicle.taxation_class = vehicleDto.taxation_class;
      vehicle.wheel_size = vehicleDto.wheel_size;
      vehicle.battery_required = vehicleDto.battery_required;
      vehicle.fuel_consume = vehicleDto.fuel_consume;
      vehicle.date_of_tested = vehicleDto.date_of_tested;

      return vehicle;
    });

    try {
      fs2.unlinkSync(filePath);
      return await this.vehiclesRepository.save(vehiclesToSave);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
