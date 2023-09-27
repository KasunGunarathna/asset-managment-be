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
import { BridgesService } from './bridges.service';
import { CreateBridgeDto } from './dto/create-bridge.dto';
import { UpdateBridgeDto } from './dto/update-bridge.dto';
import { AuthGuard } from 'src/authentication/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilterDto } from './dto/filter.dto';

@Controller('bridges')
export class BridgesController {
  constructor(private readonly bridgesService: BridgesService) {}
  @UseGuards(AuthGuard)
  @Post('/')
  async create(@Body() createBridgeDto: CreateBridgeDto) {
    const data = await this.bridgesService.create(createBridgeDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Bridge created successfully',
      data,
    };
  }
  @UseGuards(AuthGuard)
  @Get('/')
  async findAll() {
    let data = [];
    data = await this.bridgesService.findAll();
    data.map((item) => {
      item.updatedAt = new Date(item.updatedAt).toLocaleString();
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Bridge fetched successfully',
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
    data = await this.bridgesService.findAllBySearch(
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
      message: 'Users fetched successfully',
      data: data,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const data = await this.bridgesService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Bridge fetched successfully',
      data: data,
    };
  }
  @UseGuards(AuthGuard)
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateBridgeDto: UpdateBridgeDto,
  ) {
    const data = await this.bridgesService.update(+id, updateBridgeDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Bridge updated successfully',
      data: data,
    };
  }
  @UseGuards(AuthGuard)
  @Delete('/:id')
  async remove(@Param('id') id: string) {
    const data = await this.bridgesService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Bridge deleted successfully',
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
    const filePath = await this.bridgesService.saveFileLocally(
      uniqueFileName,
      file.buffer,
    );
    const parsedData = await this.bridgesService.parseCsv(filePath);
    await this.bridgesService.processBridges(parsedData, filePath);
    return {
      statusCode: HttpStatus.OK,
      message: 'CSV data uploaded and processed successfully.',
      data: 'updatedLight',
    };
  }
}
