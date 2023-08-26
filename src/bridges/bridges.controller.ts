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
import { BridgesService } from './bridges.service';
import { CreateBridgeDto } from './dto/create-bridge.dto';
import { UpdateBridgeDto } from './dto/update-bridge.dto';

@Controller('bridges')
export class BridgesController {
  constructor(private readonly bridgesService: BridgesService) {}

  @Post('/')
  async create(@Body() createBridgeDto: CreateBridgeDto) {
    const data = await this.bridgesService.create(createBridgeDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Bridge created successfully',
      data,
    };
  }

  @Get('/')
  async findAll() {
    const data = await this.bridgesService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Bridge fetched successfully',
      data: data,
    };
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const data = await this.bridgesService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Bridge fetched successfully',
      data: data,
    };
  }

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

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    const data = await this.bridgesService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Bridge deleted successfully',
      data: data,
    };
  }
}
