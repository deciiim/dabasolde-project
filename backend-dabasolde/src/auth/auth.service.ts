import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config'; // <--- 1. Import ConfigService

@Injectable()
export class AuthService {
  // 2. Inject ConfigService
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(body: any) {
    // 3. Get values from .env
    const adminUser = this.configService.get<string>('ADMIN_USER');
    const adminPass = this.configService.get<string>('ADMIN_PASS');

    if (body.username === adminUser && body.password === adminPass) {
      const payload = { username: adminUser, role: 'admin' };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}
