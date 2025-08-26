import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login-auth.dto';

interface AccessTokenResult {
  access_token: string;
  access_token_expire_time: string | undefined;
}

interface RefreshTokenResult {
  refresh_token: string;
  refresh_token_expire_time: string | undefined;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  // async signUp(registerAuthDto: RegisterAuthDto) {
  //   const ifUserExists = await this.prisma.users.findUnique({
  //     where: { Username: registerAuthDto.Username },
  //   });

  //   if (ifUserExists) {
  //     throw new BadRequestException('User already exists');
  //   }

  //   try {
  //     const salt = await bcrypt.genSalt();
  //     const hashedPassword = await bcrypt.hash(registerAuthDto.password, salt);

  //     const data = { ...registerAuthDto, password: hashedPassword };

  //     const user = await this.prisma.users.create({ data });

  //     return {
  //       status_code: 201,
  //       message: 'User created',
  //       data: {
  //         ...user,
  //       },
  //     };
  //   } catch (error) {
  //     throw new BadRequestException(error.message);
  //   }
  // }

  async signIn(loginAuthDto: LoginAuthDto) {
    try {
      const username = 'admin'
      const password = this.configService.get<string>('password');

      if (
        username !== loginAuthDto.username ||
        password !== loginAuthDto.password
      ) {
        throw new UnauthorizedException('Username or password incorrect');
      }

      const accessToken = await this.generateAccessToken({
        username,
        role: 'ADMIN',
      });

      const refreshToken = await this.generateRefreshToken({
        username,
        role: 'ADMIN',
        date: Date.now(),
      });

      return {
        res: {
          status_code: 200,
          message: 'Successfully logged in',
          data: {
            username,
            role: 'ADMIN',
            access_token: accessToken.access_token,
            access_token_expire_time: accessToken.access_token_expire_time,
          },
        },
        refresh_token: refreshToken.refresh_token,
        refresh_token_expire_time: refreshToken.refresh_token_expire_time,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async generateNewToken(token: string) {
    try {
      const data = await this.verifyToken(token);

      const accessToken = await this.generateAccessToken({
        id: data.id,
        username: data.username,
        role: data.role,
      });
      const refreshToken = await this.generateRefreshToken({
        id: data.id,
        username: data.username,
        role: data.role,
        date: Date.now(),
      });

      return {
        res: {
          status_code: 200,
          data: {
            access_token: accessToken.access_token,
            access_token_expire_time: accessToken.access_token_expire_time,
          },
        },
        refresh_token: refreshToken.refresh_token,
        refresh_token_expire_time: refreshToken.refresh_token_expire_time,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async verifyToken(token: string) {
    try {
      const res = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('refresh.refreshTokenKey'),
      });

      return res;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async generateAccessToken(payload: any): Promise<AccessTokenResult> {
    const accessTokenExpireTime = this.configService.get<string>(
      'access.accessTokenExpireTime',
    );

    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('access.accessTokenKey'),
      expiresIn: accessTokenExpireTime,
    });

    return {
      access_token: token,
      access_token_expire_time: accessTokenExpireTime,
    };
  }

  async generateRefreshToken(payload: any): Promise<RefreshTokenResult> {
    const refreshTokenExpireTime = this.configService.get<string>(
      'refresh.refreshTokenExpireTime',
    );

    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('refresh.refreshTokenKey'),
      expiresIn: refreshTokenExpireTime,
    });

    return {
      refresh_token: token,
      refresh_token_expire_time: refreshTokenExpireTime,
    };
  }
}
