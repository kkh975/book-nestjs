import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './interface/users.controller';
import { EmailModule } from 'src/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infra/db/entity/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { CqrsModule } from '@nestjs/cqrs';
import { UserEventHandler } from './user-events.handler';

@Module({
  imports: [EmailModule, TypeOrmModule.forFeature([UserEntity]), CqrsModule],
  controllers: [UsersController],
  providers: [AuthService, UsersService, UserEventHandler],
})
export class UsersModule {}
