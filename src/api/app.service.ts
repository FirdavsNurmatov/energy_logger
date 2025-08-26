import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

export default class Application {
  public static async main(): Promise<void> {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.use(helmet());
    app.enableCors({
      origin: 'http://localhost:5173',
      //  credentials: true
    });
    app.use(cookieParser());

    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );

    app.setGlobalPrefix('api/v1');

    const config = app.get(ConfigService);
    const port = config.get<number>('PORT') ?? 3000;
    await app.listen(port, () => {
      console.log(`Server: http://localhost:${port}/api/v1`);
    });
  }
}
