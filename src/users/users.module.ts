import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { EmailModule } from 'src/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [EmailModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [AuthService, UsersService],
})
export class UsersModule {}
