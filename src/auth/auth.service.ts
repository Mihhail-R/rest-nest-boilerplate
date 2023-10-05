import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

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
}
