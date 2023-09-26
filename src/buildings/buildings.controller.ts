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
import { BuildingsService } from './buildings.service';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { AuthGuard } from 'src/authentication/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilterDto } from './dto/filter.dto';

@Controller('buildings')
export class BuildingsController {
  constructor(private readonly buildingsService: BuildingsService) {}

  @UseGuards(AuthGuard)
  @Post('/')
  async create(@Body() createBuildingDto: CreateBuildingDto) {
    const data = await this.buildingsService.create(createBuildingDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Building created successfully',
      data,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/')
  async findAll() {
    let data = [];
    data = await this.buildingsService.findAll();
    data.map((item) => {
      item.updatedAt = new Date(item.updatedAt).toLocaleString();
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Buildings fetched successfully',
      data: data,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/query')
  async findAllBySearch(
    @Query(new ValidationPipe({ transform: true })) filter: FilterDto,
  ) {
    const { search, f1name, f1value, f2name, f2value } = filter;
    console.log('search, f1name, f1value, f2name, f2value');
    console.log(search, f1name, f1value, f2name, f2value);
    let data = [];
    data = await this.buildingsService.findAllBySearch(
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
      message: 'Buildings fetched successfully',
      data: data,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const data = await this.buildingsService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Building fetched successfully',
      data: data,
    };
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateBuildingDto: UpdateBuildingDto,
  ) {
    const data = await this.buildingsService.update(+id, updateBuildingDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Building updated successfully',
      data: data,
    };
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async remove(@Param('id') id: string) {
    const data = await this.buildingsService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Building deleted successfully',
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
    const filePath = await this.buildingsService.saveFileLocally(
      uniqueFileName,
      file.buffer,
    );
    // Parse CSV and validate data using CreateBuildingDto
    const parsedData = await this.buildingsService.parseCsv(filePath);
    // Process and store the data as needed
    await this.buildingsService.processBuildings(parsedData, filePath);
    return {
      statusCode: HttpStatus.OK,
      message: 'CSV data uploaded and processed successfully.',
      data: 'updatedBuilding',
    };
  }
}
