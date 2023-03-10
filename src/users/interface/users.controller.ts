import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto ';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@Controller('users')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    const { name, email, password } = dto;
    // return this.usersService.createUser(name, email, password);
    const command = new CreateUserCommand(name, email, password);
    return this.commandBus.execute(command);
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<void> {
    const { signupVerifyToken } = dto;

    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<void> {
    const { email, password } = dto;

    return await this.usersService.login(email, password);
  }

  // @UseGuards(AuthGuard)
  // @Get('/:id')
  // async getUserInfo(
  //   @Headers() headers: any,
  //   @Param('id') userId: string,
  // ): Promise<UserInfo> {
  //   const jwtString = headers.authorization.split('Bears ')[1];
  //   this.authService.verify(jwtString);

  //   return this.usersService.getUserInfo(userId);
  // }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getUserInfo(@Param('id') userId: string): Promise<UserInfo> {
    const getUserInfoQuery = new GetUserInfoQuery(userId);

    return this.queryBus.execute(getUserInfoQuery);
  }

  // @Get()
  // findAll(
  //   @Query('offset', new DefaultValuePipe(0), ParseIntPipe)
  //   offset: number,
  //   @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
  //   limit: number,
  // ) {
  //   return this.usersService.findAll();
  // }

  @Get(':id')
  findOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    if (id < 1) {
      throw new BadRequestException('id??? 0?????? ??? ???????????? ?????????.');
    }

    // return this.usersService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
