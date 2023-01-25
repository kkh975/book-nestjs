import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  login(arg0: { id: string; name: string; email: string }) {
    throw new Error('Method not implemented.');
  }

  verify(jwtString: string) {
    try {
      const payload = jwt.verify(jwtString, this.config.jwtSecret) as (
        | jwt.JwtPayload
        | string
      ) &
        User;

      const { id, email } = payload;

      return {
        userId: id,
        email,
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
