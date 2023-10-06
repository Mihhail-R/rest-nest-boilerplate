import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import RegisterDto from './dto/register.dto';
import { LocalAuthGuard } from './local.auth.guard';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { Request as Req } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
  async register(@Body() input: RegisterDto) {
    return this.authService.registerUser(input);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: Req): Promise<Express.User> {
    return req.user as User;
  }

  @Post('logout')
  async logout(@Request() req: Req): Promise<{ msg: string }> {
    req.session.destroy((err) => {
      if (err) {
        return { msg: 'Failed to destroy session' };
      }
    });

    return { msg: 'Session ended' };
  }
}
