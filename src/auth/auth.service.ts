import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { SignInCredentialsDto } from './dto/signin-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ user: User; accessToken: string }> {
    const { username, password, role, email } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await this.usersRepository.create({
      username,
      password: hashedPassword,
      role,
      email,
    });

    try {
      await this.usersRepository.save(user);

      const accessToken: string = await this.jwtService.sign({ username });
      return { user, accessToken };
    } catch (error) {
      if (error.code === '23505') {
        //duplicate username
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(
    signInCredentialsDto: SignInCredentialsDto,
  ): Promise<{ user: User; accessToken: string }> {
    const { username, password } = signInCredentialsDto;
    const user = await this.usersRepository.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return { user, accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async userExists(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ id });
    if (user) {
      return user;
    } else {
      throw new NotFoundException(`There aren't any users with the given id`);
    }
  }
}
