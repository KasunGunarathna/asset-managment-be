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
import { DrainagesService } from './drainages.service';
import { CreateDrainageDto } from './dto/create-drainages.dto';
import { UpdateDrainageDto } from './dto/update-drainages.dto';

@Controller('drainages')
export class DrainagesController {
  constructor(private readonly drainagesService: DrainagesService) {}

  @Post('/')
  async create(@Body() createDrainageDto: CreateDrainageDto) {
    const data = await this.drainagesService.create(createDrainageDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Drainage created successfully',
      data,
    };
  }

  @Get('/')
  async findAll() {
    const data = await this.drainagesService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Drainage fetched successfully',
      data: data,
    };
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const data = await this.drainagesService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Drainage fetched successfully',
      data: data,
    };
  }

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

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    const data = await this.drainagesService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Drainage deleted successfully',
      data: data,
    };
  }
}
