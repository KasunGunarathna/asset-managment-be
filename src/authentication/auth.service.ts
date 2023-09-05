import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { simpleDecrypt, simpleEncrypt } from 'src/utils/hash';

const encryptionKey = 'mysecretkey';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(nic: string, pass: string) {
    const res = simpleEncrypt(pass, encryptionKey);
    console.log(res);
    const user = await this.userService.findByNic(nic);
    if (user && simpleDecrypt(pass, encryptionKey) === user.password) {
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
