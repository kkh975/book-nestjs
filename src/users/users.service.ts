import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { nanoid } from 'nanoid';
import { UserInfo } from 'os';
import { AuthService } from 'src/auth/auth.service';
import { EmailService } from 'src/email/email.service';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  // }
  // findAll() {
  //   return `This action returns all users`;
  // }
  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }
  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }
  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
  //   return `This action returns a #${id} user`;
  // }
  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }
  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
  constructor(
    private authService: AuthService,
    private emailService: EmailService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createUser(name: string, email: string, password: string) {
    const userExist = await this.checkUserExists(email);
    if (userExist) {
      throw new UnprocessableEntityException(
        '해당 이메일로는 가입할 수 없습니다.',
      );
    }

    const signupVerifyToken = nanoid();
    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  async checkUserExists(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return !!user;
  }

  async saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    const user = new UserEntity();
    user.id = nanoid();
    user.name = name;
    user.email = email;
    user.password = password;
    user.signupVerifyToken = signupVerifyToken;

    await this.userRepository.save(user);
  }

  async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinEmail(email, signupVerifyToken);
  }

  async verifyEmail(signupVerifyToken: string) {
    const user = await this.userRepository.findOne({
      where: { signupVerifyToken },
    });
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  async login(email: string, password: string) {
    throw new Error('Method not implemented.');
  }

  async getUserInfo(userId: string): Promise<UserInfo> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
