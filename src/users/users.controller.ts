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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/')
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.usersService.create(createUserDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'User created successfully',
      data,
    };
  }

  @Get('/')
  async findAll() {
    const data = await this.usersService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'User fetched successfully',
      data: data,
    };
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const data = await this.usersService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User fetched successfully',
      data: data,
    };
  }

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const data = await this.usersService.update(+id, updateUserDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'User updated successfully',
      data: data,
    };
  }

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
