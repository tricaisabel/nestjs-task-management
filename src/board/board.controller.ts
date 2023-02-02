import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { Task } from 'src/tasks/task.entity';
import { Board } from './board.entity';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';

@Controller('boards')
@UseGuards(AuthGuard())
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Post()
  createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @GetUser() user: User,
  ): Promise<Board> {
    return this.boardService.createBoard(createBoardDto, user);
  }
}
