import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { isEmail } from 'class-validator';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    this.validateRequest(email, password);
    const user = await this.authService.validateUser(
      email.toLowerCase(),
      password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  validateRequest(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException();
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      throw new UnauthorizedException();
    }

    if (!isEmail(email)) {
      throw new UnauthorizedException();
    }
  }
}
