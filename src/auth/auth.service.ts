import { HttpException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import RegisterDto from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByEmail(email.toLowerCase());

    if (!user) {
      return null;
    }

    const validate = await this.usersService.validatePassword(pass, user);

    if (validate) {
      return user;
    }

    return null;
  }

  async registerUser(input: RegisterDto) {
    if (!input.name || !input.email || !input.password) {
      throw new HttpException('Missing input', 400);
    }

    const userWithEmail = await this.usersService.findByEmail(input.email);

    if (userWithEmail) {
      throw new HttpException('Email is already in use', 400);
    }

    input.password = await this.usersService.hashPassword(input.password);

    return this.usersService.create(input);
  }
}
