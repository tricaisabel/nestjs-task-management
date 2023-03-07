import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { SignInCredentialsDto } from './dto/signin-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { FileService } from '../files/file.service';
import DatabaseFile from '../files/file.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly databaseFilesService: FileService,
    private connection: Connection,
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

  async getUsers(): Promise<User[]> {
    const users = await this.usersRepository.find();
    return users;
  }

  async addAvatar(userId: string, imageBuffer: Buffer, filename: string) {
    //set up transaction
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, userId);
      const oldAvatarId = user.avatarId;

      //add new avatar to files and update avatar id
      const avatar = await this.databaseFilesService.uploadDatabaseFile(
        imageBuffer,
        filename,
        queryRunner,
      );

      await queryRunner.manager.update(User, userId, {
        avatarId: avatar.id,
      });

      //if avatar already existed delete the old one
      if (oldAvatarId) {
        await queryRunner.manager.delete(DatabaseFile, { id: oldAvatarId });
      }

      await queryRunner.commitTransaction();

      return this.userExists(userId);
    } catch (err) {
      //rollback if something goes wrong
      await queryRunner.rollbackTransaction();
      console.log(err);
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }
}
