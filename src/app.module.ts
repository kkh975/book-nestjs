import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ApiController } from './api/api.controller';
import { EmailService } from './email/email.service';

@Module({
  imports: [UsersModule],
  controllers: [AppController, ApiController],
  providers: [AppService, EmailService],
})
export class AppModule {}
