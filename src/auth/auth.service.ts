import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { jwtConstants } from './constants';
import { TokenDto } from './dto/token-dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    email: string,
    pass: string,
  ): Promise<{ accessToken: string; user: User; message: string }> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isPassMatch = bcrypt.compare(pass, user.password);

    if (!isPassMatch) {
      throw new UnauthorizedException();
    }

    const payload = { id: user.id, email: user.email };

    const tokens = await this.generateTokenPair(payload);

    return {
      message: 'Login successful',
      user,
      ...tokens,
    };
  }

  async refreshTokens({ refreshToken }: TokenDto) {
    if (!refreshToken) throw new UnauthorizedException('Unauthenticated!');
    const result = await this.jwtService.verifyAsync(refreshToken);
    if (!result) throw new UnauthorizedException('Invalid token, or expired!');

    const user = await this.userService.findByEmail(result.email);
    const token = await this.generateTokenPair({
      id: user.id,
      email: user.email,
    });

    return {
      message: 'Login successful',
      user,
      ...token,
    };
  }

  async generateTokenPair(userPayload: { id: number; email: string }) {
    const accessToken = await this.jwtService.signAsync(userPayload, {
      expiresIn: '1d',
      secret: jwtConstants.secret,
    });

    const refreshToken = await this.jwtService.signAsync(userPayload, {
      expiresIn: '7d',
      secret: jwtConstants.secret,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
