import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() userLoginDto: CreateAuthDto) {
    const data = await this.authService.login(
      userLoginDto.nic,
      userLoginDto.password,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'User login successfully',
      data: data,
    };
  }
}
