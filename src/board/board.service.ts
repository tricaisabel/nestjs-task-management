import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.entity';
import { Repository } from 'typeorm';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
    private authService: AuthService,
  ) {}

  async isPartOfBoardTeam(idUser: string, idBoard: string): Promise<boolean> {
    console.log(idUser, idBoard);
    const board = await this.getBoardById(idBoard);
    const authUser = await this.authService.userExists(idUser);
    const found = board.team.find((user) => user.id === authUser.id);
    if (!found && board.createdBy.id !== idUser) {
      return false;
    } else {
      return true;
    }
  }

  async createBoard(
    createBoardDto: CreateBoardDto,
    user: User,
  ): Promise<Board> {
    const { title } = createBoardDto;
    const board = this.boardRepository.create({
      title,
      createdBy: user,
      team: [],
    });
    await this.boardRepository.save(board);
    return board;
  }

  async getBoardById(idBoard: string): Promise<Board> {
    const board = await this.boardRepository.findOne({
      where: {
        id: idBoard,
      },
      relations: ['tasks', 'team'],
    });
    if (board) {
      delete board.createdBy.password;
      return board;
    } else {
      throw new NotFoundException(`There aren't any boards with the given id`);
    }
  }

  async getBoards(): Promise<Board[]> {
    const boards = await this.boardRepository.find({
      relations: ['tasks', 'team'],
    });
    return boards;
  }

  async addUserToBoardTeam(
    idUser: string,
    idBoard: string,
    user: User,
  ): Promise<User | void> {
    const newUser = await this.authService.userExists(idUser);
    const board = await this.getBoardById(idBoard);
    const isPartOfTeam = await this.isPartOfBoardTeam(idUser, idBoard);
    if (isPartOfTeam === true) {
      throw new BadRequestException('The user is already part of that team');
    }

    if (board.createdBy.id === user.id) {
      board.team.push(newUser);
      await this.boardRepository.save(board);
      return newUser;
    } else
      throw new UnauthorizedException(
        'Users can be added only by the project creator',
      );
  }
}
