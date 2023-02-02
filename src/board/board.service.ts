import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Repository } from 'typeorm';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
  ) {}

  async createBoard(
    createBoardDto: CreateBoardDto,
    user: User,
  ): Promise<Board> {
    const { title } = createBoardDto;
    const board = await this.boardRepository.create({
      title,
      createdBy: user,
    });
    await this.boardRepository.save(board);
    return board;
  }

  async getBoardById(id: string): Promise<Board> {
    const board = await this.boardRepository.findOne({
      where: {
        id,
      },
      relations: ['tasks'],
    });
    if (board) {
      delete board.createdBy.password;
      return board;
    } else {
      throw new NotFoundException(`There aren't any boards with the given id`);
    }
  }
}
