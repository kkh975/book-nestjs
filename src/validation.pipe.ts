import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export class validationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;

    // metatype이 지원하는 객체인지,
    if (!metatype || !this.#toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value); // json > class 교체
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }

    return value;
  }

  #toValidate(metatype: ArgumentMetadata['metatype']) {
    const types: ArgumentMetadata['metatype'][] = [
      String,
      Boolean,
      Number,
      Array,
      Object,
    ];

    return !types.includes(metatype);
  }
}
