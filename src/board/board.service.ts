import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/user.entity';
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

  async isPartOfBoardTeam(idUser: string, idBoard: string): Promise<void> {
    console.log(idUser, idBoard);
    const board = await this.getBoardById(idBoard);
    const authUser = await this.authService.userExists(idUser);
    const found = board.team.find((user) => user.id === authUser.id);
    if (!found) {
      throw new NotFoundException();
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

  async addUserToBoardTeam(
    idUser: string,
    idBoard: string,
    user: User,
  ): Promise<void> {
    const newUser = await this.authService.userExists(idUser);
    const board = await this.getBoardById(idBoard);

    if (board.createdBy.id === user.id) board.team.push(newUser);
    else
      throw new UnauthorizedException(
        'Users can be added only by the project creator',
      );
    await this.boardRepository.save(board);
  }
}
