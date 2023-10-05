import {
  Body,
  Controller,
  HttpException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import RegisterDto from './dto/register.dto';
import { LocalAuthGuard } from './local.auth.guard';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() input: RegisterDto) {
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

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<Omit<User, 'password'>> {
    return req.user;
  }

  @Post('logout')
  async logout(@Request() req): Promise<{ msg: string }> {
    req.session.destroy();

    return { msg: 'Session ended' };
  }
}
