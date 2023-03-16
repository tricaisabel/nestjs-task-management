import { JwtService } from '@nestjs/jwt';
import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import DatabaseFile from '../files/file.entity';
import { FileService } from '../files/file.service';
import { users, newUser } from '../../test/test.data';
import { Repository, Connection } from 'typeorm';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

const mockUserRepository = () => ({
  findOne: jest.fn(async (params) => {
    const found = users.find((user) => user.username === params.username);
    const salt = await bcrypt.genSalt();
    console.log(found.password);
    const hashedPassword = await bcrypt.hash(found.password, salt);
    return Promise.resolve({ ...found, password: hashedPassword });
  }),
  create: jest.fn((board) => board),
  save: jest.fn(),
});

const mockConnection = () => ({});
const mockDbFile = () => ({});

describe('AuthService', () => {
  let authService: AuthService;
  let module: TestingModule;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        AuthService,
        FileService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepository,
        },
        {
          provide: getRepositoryToken(DatabaseFile),
          useFactory: mockDbFile,
        },
        {
          provide: Connection,
          useFactory: mockConnection,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'token'),
            secret: 'topsecret51',
          },
        },
      ],
    }).compile();

    authService = module.get(AuthService);
    userRepository = module.get(getRepositoryToken(User));
    jwtService = module.get(JwtService);
  });

  describe('signUp', () => {
    it('Should hash password', async () => {
      const result = await authService.signUp(newUser);

      const isHashed = await bcrypt.compare(
        newUser.password,
        result.user.password,
      );
      expect(isHashed).toBeTruthy();
    });

    it('Should return the initial user (except password)', async () => {
      const result = await authService.signUp(newUser);
      expect(result.user.email).toEqual(newUser.email);
      expect(result.user.username).toEqual(newUser.username);
      expect(result.user.role).toEqual(newUser.role);
      expect(result.user.password).not.toEqual(newUser.password);
    });

    it('Should return jwt Token', async () => {
      const result = await authService.signUp(newUser);
      expect(result.accessToken).toBeTruthy();
    });

    it('Should return an error, if the user alredy exists', async () => {
      try {
        await authService.signUp(users[0]);
      } catch (e) {
        expect(e.message).toEqual('Username already exists');
      }
    });
  });

  describe('signIn', () => {
    it('should return the found user from the repository', async () => {
      const result = await authService.signIn({
        username: users[0].username,
        password: users[0].password,
      });
      expect(result.user.email).toEqual(users[0].email);
      expect(result.user.username).toEqual(users[0].username);
      expect(result.user.role).toEqual(users[0].role);
      expect(result.user.password).not.toEqual(users[0].password);
    });

    it('should return a jwt token for the user', async () => {
      const result = await authService.signIn({
        username: users[0].username,
        password: users[0].password,
      });
      expect(result.accessToken).toBeTruthy();
    });

    it('username is incorrect - should return the Please check your login credentials error', async () => {
      expect(
        await authService.signIn({
          username: 'something that does not exist',
          password: 'something else',
        }),
      ).rejects.toThrowError();
    });
  });
});
