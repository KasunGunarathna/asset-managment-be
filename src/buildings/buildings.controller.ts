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
  NotFoundException,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { BuildingsService } from './buildings.service';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { AuthGuard } from 'src/authentication/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilterDto } from './dto/filter.dto';
import { BASE_URL } from 'src/utils/const';

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
    data.forEach((item) => {
      item.photoUrl = `${BASE_URL}/buildings/building_image/${item.id}`;
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
    let data = [];
    data = await this.buildingsService.findAllBySearch(
      search,
      f1name,
      f1value,
      f2name,
      f2value,
    );
    data.forEach((item) => {
      item.photoUrl = `${BASE_URL}/buildings/building_image/${item.id}`;
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
    let data = null;
    data = await this.buildingsService.findOne(+id);
    data.photoUrl = `${BASE_URL}/buildings/building_image/${data.id}`;
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
  @Post('upload_building_image/:id')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }

    const uniqueFileName = `${id}-${new Date().getTime()}-${file.originalname}`;
    const filePath = await this.buildingsService.saveFileLocally(
      uniqueFileName,
      file.buffer,
    );

    const updatedLight = await this.buildingsService.updateImage(+id, filePath);

    if (!updatedLight) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'StreetLight update successfully',
      data: updatedLight,
    };
  }

  @Get('building_image/:id')
  async getProfileImage(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<void> {
    const building = await this.buildingsService.findOne(id);
    res.setHeader('Content-Type', 'image/jpeg');
    const imageStream = await this.buildingsService.readProfileImage(
      building.photo,
    );
    imageStream.pipe(res);
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
    const parsedData = await this.buildingsService.parseCsv(filePath);
    await this.buildingsService.processBuildings(parsedData, filePath);
    return {
      statusCode: HttpStatus.OK,
      message: 'CSV data uploaded and processed successfully.',
      data: 'updatedBuilding',
    };
  }
}
