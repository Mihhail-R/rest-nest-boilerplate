import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async create(input: CreateUserDto): Promise<Omit<User, 'password'>> {
    const newUser = await this.usersRepository.save(new User(input));
    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };
  }

  findAll(): Promise<Omit<User[], 'password'>> {
    return this.usersRepository.find({
      select: ['id', 'name', 'email'],
    });
  }

  findOne(id: number): Promise<Omit<User, 'password'>> {
    return this.usersRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email'],
    });
  }

  findByEmail(email: string): Promise<Omit<User, 'password'>> {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email'],
    });
  }

  getUserPasswordHash(
    id: number,
  ): Promise<Omit<User, 'name' | 'email' | 'id'>> {
    return this.usersRepository.findOne({
      where: { id },
      select: ['password'],
    });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    if (updateUserDto.name) {
      user.name = updateUserDto.name;
    }

    if (updateUserDto.email) {
      user.email = updateUserDto.email;
    }

    if (updateUserDto.password) {
      user.password = updateUserDto.password;
    }

    return this.usersRepository.save(user);
  }

  remove(id: number) {
    return this.usersRepository.delete({ id });
  }

  async validatePassword(
    plainTextPassword: string,
    user: Omit<User, 'password'>,
  ) {
    const hashedPassword = await this.getUserPasswordHash(user.id);

    return await compare(plainTextPassword, hashedPassword.password);
  }

  async hashPassword(password: string) {
    return await hash(password, 10);
  }
}
