import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { Connection, Repository } from 'typeorm';
import { Board } from './board.entity';
import { BoardService } from './board.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { FileService } from '../files/file.service';
import { User } from '../auth/user.entity';
import DatabaseFile from '../files/file.entity';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { boards, users } from '../../test/test.data';

const mockBoardRepository = () => ({
  find: jest.fn().mockResolvedValue(boards),
  create: jest.fn((board) => board),
  save: jest.fn(),
  findOne: jest.fn((params) => {
    return Promise.resolve(params.where.id === '1234' ? boards[0] : null);
  }),
});

const mockUserRepository = () => ({
  findOne: jest.fn((params) => {
    const found = users.find((user) => user.id === params.id);
    return Promise.resolve(found);
  }),
});

const mockConnection = () => ({});
const mockDbFile = () => ({});

describe('BoardService', () => {
  let boardService: BoardService;
  let authService: AuthService;
  let module: TestingModule;
  let boardRepository: Repository<Board>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        BoardService,
        AuthService,
        JwtService,
        FileService,
        {
          provide: getRepositoryToken(Board),
          useFactory: mockBoardRepository,
        },
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
      ],
    }).compile();

    boardService = module.get(BoardService);
    authService = module.get(AuthService);
    boardRepository = module.get(getRepositoryToken(Board));
  });

  describe('getBoards', () => {
    it('calls the repository find method and returns boards', async () => {
      const receivedBoards = await boardService.getBoards();
      expect(receivedBoards).toEqual(boards);
    });
  });

  describe('getBoardById', () => {
    it('returns the board if it exists', async () => {
      const foundBoard = await boardService.getBoardById('1234');
      expect(foundBoard).toEqual(boards[0]);
    });

    it('does not return the password', async () => {
      const foundBoard = await boardService.getBoardById('1234');
      expect(foundBoard.createdBy.password).toBeUndefined();
    });

    it('throws NotFoundException if the boards does not exist', async () => {
      try {
        await boardService.getBoardById('555');
      } catch (e) {
        expect(e.message).toEqual(`There aren't any boards with the given id`);
      }
    });
  });

  describe('createBoard', () => {
    it('calls the create function of the board repository', async () => {
      await boardService.createBoard({ title: 'My new board' }, users[0]);
      expect(boardRepository.create).toBeCalled();
    });

    it('saves and returns the newly created board', async () => {
      const createdBoard = await boardService.createBoard(
        { title: 'My new board' },
        users[0],
      );
      expect(createdBoard.title).toEqual('My new board');
      expect(createdBoard.createdBy).toEqual(users[0]);
    });
  });

  describe('addUserToBoardTeam', () => {
    it('throws NotFoundException if the new user does not exist', async () => {
      expect(
        boardService.addUserToBoardTeam('333', '1234', users[0]),
      ).rejects.toThrow(NotFoundException);
    });
    it('throws UnauthorizedException if the looged user in not the manager of the team', () => {
      expect(
        boardService.addUserToBoardTeam('3', '1234', users[1]),
      ).rejects.toThrow(UnauthorizedException);
    });
    it('throws BadRequestException if the new user if already part of the team', () => {
      expect(
        boardService.addUserToBoardTeam('1', '1234', users[0]),
      ).rejects.toThrow(BadRequestException);
    });
    it('adds the user to the team if it exists, is not already a member and was added by manager', async () => {
      const addedUser = await boardService.addUserToBoardTeam(
        '3',
        '1234',
        users[0],
      );
      expect(addedUser).toEqual(users[2]);
    });
  });
});
