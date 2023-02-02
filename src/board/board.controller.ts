import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Head,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { Board } from './board.entity';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';

@Controller('boards')
@UseGuards(AuthGuard())
@UseInterceptors(ClassSerializerInterceptor)
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Post()
  createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @GetUser() user: User,
  ): Promise<Board> {
    return this.boardService.createBoard(createBoardDto, user);
  }

  @Get('/:id')
  getBoardById(@Param('id') id: string): Promise<Board> {
    return this.boardService.getBoardById(id);
  }

  @Post('/:id/team')
  addUserToBoardTeam(
    @Param('id') idBoard: string,
    @Body('userId') idUser: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.boardService.addUserToBoardTeam(idUser, idBoard, user);
  }

  @Head('/:id/team')
  isPartOfBoardTeam(
    @GetUser() user: User,
    @Param('id') idBoard: string,
  ): Promise<void> {
    console.log(user.id, idBoard);
    return this.boardService.isPartOfBoardTeam(user.id, idBoard);
  }
}
