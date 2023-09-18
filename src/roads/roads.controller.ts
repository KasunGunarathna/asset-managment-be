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
  NotFoundException,
  Res,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
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
    let data = [];
    data = await this.roadsService.findAll();
    data.map((item) => {
      item.startingPhotoUrl = `http://localhost:3000/roads/road_image/${item.id}?photo=1`;
      item.endPhotoUrl = `http://localhost:3000/roads/road_image/${item.id}?photo=2`;
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Road fetched successfully',
      data: data,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/query/:query')
  async findAllBySearch(@Param('query') query: string) {
    let data = [];
    data = await this.roadsService.findAllBySearch(query);
    data.map((item) => {
      item.startingPhotoUrl = `http://localhost:3000/roads/road_image/${item.id}?photo=1`;
      item.endPhotoUrl = `http://localhost:3000/roads/road_image/${item.id}?photo=2`;
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
    let data = null;
    data = await this.roadsService.findOne(+id);
    data.startingPhotoUrl = `http://localhost:3000/roads/road_image/${data.id}?photo=1`;
    data.endPhotoUrl = `http://localhost:3000/roads/road_image/${data.id}?photo=2`;
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

  @UseGuards(AuthGuard)
  @Post('upload_road_image/:id')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Param('id') id: string,
    @Query() query: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(id, query?.photo);
    const photo = query?.photo;
    if (photo > 2 || photo < 1) {
      throw new BadRequestException('Out of Range photo');
    }
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }

    const uniqueFileName = `${id}-${new Date().getTime()}-${file.originalname}`;
    const filePath = await this.roadsService.saveFileLocally(
      uniqueFileName,
      file.buffer,
    );

    const updatedLight = await this.roadsService.updateImage(
      +id,
      filePath,
      photo,
    );

    if (!updatedLight) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Road update successfully',
      data: updatedLight,
    };
  }

  @Get('road_image/:id')
  async getProfileImage(
    @Param('id') id: number,
    @Query() query: any,
    @Res() res: Response,
  ): Promise<void> {
    console.log(id, query?.photo);
    const photo = query?.photo;
    if (photo > 2 || photo < 1) {
      throw new BadRequestException('Out of Range photo');
    }
    const light = await this.roadsService.findOne(id);
    const image =
      photo == 1 ? light.starting_point_photo : light.end_point_photo;
    res.setHeader('Content-Type', 'image/jpeg');
    const imageStream = await this.roadsService.readProfileImage(image);
    imageStream.pipe(res);
  }
}
