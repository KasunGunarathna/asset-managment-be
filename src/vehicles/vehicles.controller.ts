import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { AuthGuard } from 'src/authentication/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilterDto } from './dto/filter.dto';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @UseGuards(AuthGuard)
  @Post('/')
  async create(@Body() createVehicleDto: CreateVehicleDto) {
    const data = await this.vehiclesService.create(createVehicleDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Vehicle created successfully',
      data,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/')
  async findAll() {
    let data = [];
    data = await this.vehiclesService.findAll();
    data.map((item) => {
      item.updatedAt = new Date(item.updatedAt).toLocaleString();
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Vehicles fetched successfully',
      data: data,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/query')
  async findAllBySearch(
    @Query(new ValidationPipe({ transform: true })) filter: FilterDto,
  ) {
    const { search, f1name, f1value, f2name, f2value } = filter;
    let data = [];
    data = await this.vehiclesService.findAllBySearch(
      search,
      f1name,
      f1value,
      f2name,
      f2value,
    );
    data.map((item) => {
      item.updatedAt = new Date(item.updatedAt).toLocaleString();
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Vehicles fetched successfully',
      data: data,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const data = await this.vehiclesService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Vehicle fetched successfully',
      data: data,
    };
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    const data = await this.vehiclesService.update(+id, updateVehicleDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Vehicle updated successfully',
      data: data,
    };
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async remove(@Param('id') id: string) {
    const data = await this.vehiclesService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Vehicle deleted successfully',
      data: data,
    };
  }

  @UseGuards(AuthGuard)
  @Post('bulk-upload')
  @UseInterceptors(FileInterceptor('file'))
  async bulkUpload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }
    const uniqueFileName = `${new Date().getTime()}-${file.originalname}`;
    const filePath = await this.vehiclesService.saveFileLocally(
      uniqueFileName,
      file.buffer,
    );
    const parsedData = await this.vehiclesService.parseCsv(filePath);
    await this.vehiclesService.processVehicles(parsedData, filePath);
    return {
      statusCode: HttpStatus.OK,
      message: 'CSV data uploaded and processed successfully.',
      data: 'updatedLight',
    };
  }
}
