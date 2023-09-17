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
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { RoadsService } from './roads.service';
import { CreateRoadDto } from './dto/create-roads.dto';
import { UpdateRoadDto } from './dto/update-roads.dto';
import { AuthGuard } from 'src/authentication/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('roads')
export class RoadsController {
  constructor(private readonly roadsService: RoadsService) {}
  @UseGuards(AuthGuard)
  @Post('/')
  async create(@Body() createRoadDto: CreateRoadDto) {
    const data = await this.roadsService.create(createRoadDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Road created successfully',
      data,
    };
  }
  @UseGuards(AuthGuard)
  @Get('/')
  async findAll() {
    const data = await this.roadsService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Road fetched successfully',
      data: data,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/query/:query')
  async findAllBySearch(@Param('query') query: string) {
    const data = await this.roadsService.findAllBySearch(query);
    return {
      statusCode: HttpStatus.OK,
      message: 'Users fetched successfully',
      data: data,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const data = await this.roadsService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Road fetched successfully',
      data: data,
    };
  }
  @UseGuards(AuthGuard)
  @Patch('/:id')
  async update(@Param('id') id: string, @Body() updateRoadDto: UpdateRoadDto) {
    const data = await this.roadsService.update(+id, updateRoadDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Road updated successfully',
      data: data,
    };
  }
  @UseGuards(AuthGuard)
  @Delete('/:id')
  async remove(@Param('id') id: string) {
    const data = await this.roadsService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Road deleted successfully',
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
    const filePath = await this.roadsService.saveFileLocally(
      uniqueFileName,
      file.buffer,
    );
    // Parse CSV and validate data using CreateStreetLightDto
    const parsedData = await this.roadsService.parseCsv(filePath);
    // Process and store the data as needed
    await this.roadsService.processBridges(parsedData, filePath);
    return {
      statusCode: HttpStatus.OK,
      message: 'CSV data uploaded and processed successfully.',
      data: 'updatedLight',
    };
  }
}
