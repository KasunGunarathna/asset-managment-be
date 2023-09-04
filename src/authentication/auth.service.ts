import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(nic: string, pass: string) {
    const user = await this.userService.findByNic(nic);
    if (user && bcrypt.compareSync(pass, user.password)) {
      const payload = { sub: user.id, username: user.name };
      const expiresIn = 3600;
      return {
        access_token: await this.jwtService.signAsync(payload),
        expires_in: expiresIn,
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}
