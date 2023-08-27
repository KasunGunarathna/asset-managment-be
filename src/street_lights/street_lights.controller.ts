import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { StreetLightsService } from './street_lights.service';
import { CreateStreetLightDto } from './dto/create-street_lights.dto';
import { UpdateStreetLightDto } from './dto/update-street_lights.dto';

@Controller('street_lights')
export class StreetLightsController {
  constructor(private readonly streetLightsService: StreetLightsService) {}

  @Post('/')
  async create(@Body() createStreetLightDto: CreateStreetLightDto) {
    const data = await this.streetLightsService.create(createStreetLightDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'StreetLight created successfully',
      data,
    };
  }

  @Get('/')
  async findAll() {
    const data = await this.streetLightsService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'StreetLight fetched successfully',
      data: data,
    };
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const data = await this.streetLightsService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'StreetLight fetched successfully',
      data: data,
    };
  }

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

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    const data = await this.streetLightsService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'StreetLight deleted successfully',
      data: data,
    };
  }
}
