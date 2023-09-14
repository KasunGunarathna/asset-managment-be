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
  NotFoundException,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { StreetLightsService } from './street_lights.service';
import { CreateStreetLightDto } from './dto/create-street_lights.dto';
import { UpdateStreetLightDto } from './dto/update-street_lights.dto';
import { AuthGuard } from 'src/authentication/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('street_lights')
export class StreetLightsController {
  constructor(private readonly streetLightsService: StreetLightsService) {}
  @UseGuards(AuthGuard)
  @Post('/')
  async create(@Body() createStreetLightDto: CreateStreetLightDto) {
    const data = await this.streetLightsService.create(createStreetLightDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'StreetLight created successfully',
      data,
    };
  }
  @UseGuards(AuthGuard)
  @Get('/query/:query')
  async findAllBySearch(@Param('query') query: string) {
    const data = await this.streetLightsService.findAllBySearch(query);
    return {
      statusCode: HttpStatus.OK,
      message: 'Users fetched successfully',
      data: data,
    };
  }
  @UseGuards(AuthGuard)
  @Get('/')
  async findAll() {
    const data = await this.streetLightsService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'StreetLight fetched successfully',
      data: data,
    };
  }
  @UseGuards(AuthGuard)
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const data = await this.streetLightsService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'StreetLight fetched successfully',
      data: data,
    };
  }
  @UseGuards(AuthGuard)
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateStreetLightDto: UpdateStreetLightDto,
  ) {
    const data = await this.streetLightsService.update(
      +id,
      updateStreetLightDto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'StreetLight updated successfully',
      data: data,
    };
  }
  @UseGuards(AuthGuard)
  @Delete('/:id')
  async remove(@Param('id') id: string) {
    const data = await this.streetLightsService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'StreetLight deleted successfully',
      data: data,
    };
  }
  @UseGuards(AuthGuard)
  @Post('upload-road-image/:id')
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
    const filePath = await this.streetLightsService.saveFileLocally(
      uniqueFileName,
      file.buffer,
    );

    const updatedLight = await this.streetLightsService.updateImage(
      +id,
      filePath,
    );

    if (!updatedLight) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'StreetLight update successfully',
      data: updatedLight,
    };
  }

  @Get('road-image/:id')
  async getProfileImage(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<void> {
    const light = await this.streetLightsService.findOne(id);

    if (!light || !light.photo) {
      throw new NotFoundException(`Road with ID ${id} or Road image not found`);
    }
    res.setHeader('Content-Type', 'image/jpeg');
    const imageStream = await this.streetLightsService.readProfileImage(
      light.photo,
    );
    imageStream.pipe(res);
  }
}
