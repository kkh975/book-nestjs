import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Transform(
    ({ value, obj }: { value: CreateUserDto['name']; obj: CreateUserDto }) => {
      if (obj.password.includes(obj.name.trim())) {
        throw new BadRequestException(
          'password는 name과 같은 문자열을 포함할 수 없습니다.',
        );
      }

      return value.trim();
    },
  )
  @MinLength(1)
  @MaxLength(20)
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @Matches(/^[A-Zaz\d!@#$%^&*()]{8,30}$/)
  readonly password: string;
}
