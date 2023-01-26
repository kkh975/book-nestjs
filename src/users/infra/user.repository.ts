import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { UserFactory } from '../domain/user.factory';
import { IUserRepository } from '../domain/user.repository';
import { UserEntity } from './db/entity/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    private connection: Connection,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private userFactory: UserFactory,
  ) {}

  async findByEmail(email: string) {
    const userEntity = await this.userRepository.findOne({
      where: { email },
    });
    if (!userEntity) {
      return null;
    }

    const { id, name, password, signupVerifyToken } = userEntity;

    return this.userFactory.reconstitute(
      id,
      name,
      email,
      signupVerifyToken,
      password,
    );
  }
  async save(
    id: string,
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    await this.connection.transaction(async (manager) => {
      const user = new UserEntity();
      user.id = id;
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await manager.save(user);
    });
  }
}
