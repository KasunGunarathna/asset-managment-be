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
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { DrainagesService } from './drainages.service';
import { CreateDrainageDto } from './dto/create-drainages.dto';
import { UpdateDrainageDto } from './dto/update-drainages.dto';
import { AuthGuard } from 'src/authentication/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilterDto } from './dto/filter.dto';

@Controller('drainages')
export class DrainagesController {
  constructor(private readonly drainagesService: DrainagesService) {}
  @UseGuards(AuthGuard)
  @Post('/')
  async create(@Body() createDrainageDto: CreateDrainageDto) {
    const data = await this.drainagesService.create(createDrainageDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Drainage created successfully',
      data,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/query')
  async findAllBySearch(
    @Query(new ValidationPipe({ transform: true })) filter: FilterDto,
  ) {
    const { search, f1name, f1value, f2name, f2value } = filter;
    let data = [];
    data = await this.drainagesService.findAllBySearch(
      search,
      f1name,
      f1value,
      f2name,
      f2value,
    );
    data.forEach((item) => {
      item.updatedAt = new Date(item.updatedAt).toLocaleString();
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Users fetched successfully',
      data: data,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/')
  async findAll() {
    let data = [];
    data = await this.drainagesService.findAll();
    data.forEach((item) => {
      item.updatedAt = new Date(item.updatedAt).toLocaleString();
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Drainage fetched successfully',
      data: data,
    };
  }
  @UseGuards(AuthGuard)
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const data = await this.drainagesService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Drainage fetched successfully',
      data: data,
    };
  }
  @UseGuards(AuthGuard)
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateDrainageDto: UpdateDrainageDto,
  ) {
    const data = await this.drainagesService.update(+id, updateDrainageDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Drainage updated successfully',
      data: data,
    };
  }
  @UseGuards(AuthGuard)
  @Delete('/:id')
  async remove(@Param('id') id: string) {
    const data = await this.drainagesService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Drainage deleted successfully',
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
    const filePath = await this.drainagesService.saveFileLocally(
      uniqueFileName,
      file.buffer,
    );
    // Parse CSV and validate data using CreateStreetLightDto
    const parsedData = await this.drainagesService.parseCsv(filePath);

    await this.drainagesService.processDrainage(parsedData, filePath);
    return {
      statusCode: HttpStatus.OK,
      message: 'CSV data uploaded and processed successfully.',
      data: 'updatedLight',
    };
  }
}
