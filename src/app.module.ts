import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { ApiController } from './api/api.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth/auth.service';
import * as winston from 'winston';
import * as nestWinston from 'nest-winston';
import { ExceptionModule } from './exception/exception.module';
import { LoggingModule } from './logging/logging.module';
import { HealthCheckController } from './health-check/health-check.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/.${process.env.NODE_ENV}.env`],
      load: [emailConfig],
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: 'test',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    }),
    nestWinston.WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinston.utilities.format.nestLike('MyApp', {
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
    ExceptionModule,
    LoggingModule,
    TerminusModule,
    HttpModule,
  ],
  controllers: [AppController, ApiController, HealthCheckController],
  providers: [ConfigService, AuthService],
})
export class AppModule {}
