import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import type { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Post('register')
  // signUp(@Body() registerAuthDto: RegisterAuthDto) {
  //   return this.authService.signUp(registerAuthDto);
  // }

  @HttpCode(200)
  @Post('login')
  async signIn(
    @Body() loginAuthDto: LoginAuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const res = await this.authService.signIn(loginAuthDto);
    response.cookie('refreshToken', res?.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict', // XSRF hujumlardan himoya
    });

    return res.res;
  }

  @HttpCode(200)
  @Post('refresh')
  async generateNewToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const refreshToken = request.cookies['refreshToken'];
      const res = await this.authService.generateNewToken(refreshToken);

      response.cookie('refreshToken', res?.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict', // XSRF hujumlardan himoya
      });

      return res?.res;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
