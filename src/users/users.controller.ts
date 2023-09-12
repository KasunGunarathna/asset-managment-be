import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/authentication/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(AuthGuard)
  @Post('/')
  async create(@Body() createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByNic(createUserDto.nic);
    if (existingUser) {
      throw new BadRequestException('User with this NIC already exists');
    }
    const data = await this.usersService.create(createUserDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'User created successfully',
      data,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/')
  async findAll() {
    const data = await this.usersService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Users fetched successfully',
      data: data,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/query/:query')
  async findAllBySearch(@Param('query') query: string) {
    const data = await this.usersService.findAllBySearch(query);
    return {
      statusCode: HttpStatus.OK,
      message: 'Users fetched successfully',
      data: data,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const data = await this.usersService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User fetched successfully',
      data: data,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/nic/:nic')
  async findOneByNic(@Param('nic') nic: string) {
    const data = await this.usersService.findOneByNic(nic);
    return {
      statusCode: HttpStatus.OK,
      message: 'User fetched successfully',
      data: data,
    };
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const data = await this.usersService.update(+id, updateUserDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'User updated successfully',
      data: data,
    };
  }
  @UseGuards(AuthGuard)
  @Delete('/:id')
  async remove(@Param('id') id: string) {
    const data = await this.usersService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User deleted successfully',
      data: data,
    };
  }
}
