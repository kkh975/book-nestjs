import { NotFoundException } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../infra/db/entity/user.entity';
import { GetUserInfoQuery } from './get-user-info.query';

export class GetUserInfoQueryHandler
  implements ICommandHandler<GetUserInfoQuery>
{
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async execute(query: GetUserInfoQuery) {
    const { userId } = query;
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
