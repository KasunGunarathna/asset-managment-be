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
} from '@nestjs/common';
import { StreetLightsService } from './street_lights.service';
import { CreateStreetLightDto } from './dto/create-street_lights.dto';
import { UpdateStreetLightDto } from './dto/update-street_lights.dto';
import { AuthGuard } from 'src/authentication/auth.guard';

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
}
