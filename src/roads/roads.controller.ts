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
import { RoadsService } from './roads.service';
import { CreateRoadDto } from './dto/create-roads.dto';
import { UpdateRoadDto } from './dto/update-roads.dto';

@Controller('roads')
export class RoadsController {
  constructor(private readonly roadsService: RoadsService) {}

  @Post('/')
  async create(@Body() createRoadDto: CreateRoadDto) {
    const data = await this.roadsService.create(createRoadDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Road created successfully',
      data,
    };
  }

  @Get('/')
  async findAll() {
    const data = await this.roadsService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Road fetched successfully',
      data: data,
    };
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const data = await this.roadsService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Road fetched successfully',
      data: data,
    };
  }

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() updateRoadDto: UpdateRoadDto) {
    const data = await this.roadsService.update(+id, updateRoadDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Road updated successfully',
      data: data,
    };
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    const data = await this.roadsService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Road deleted successfully',
      data: data,
    };
  }
}
