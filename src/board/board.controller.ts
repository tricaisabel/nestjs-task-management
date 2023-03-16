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
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { Board } from './board.entity';
import { BoardService } from './board.service';
import { CreateBoardDto, GetBoardDto } from './dto/board.dto';

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

  @Get()
  getBoards(
    @GetUser() user: User,
    @Body() body: GetBoardDto,
  ): Promise<Board[]> {
    let fullSet = body.fullSet === 'true' ? true : false;
    return this.boardService.getBoards(user, fullSet);
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
  ): Promise<User | void> {
    return this.boardService.addUserToBoardTeam(idUser, idBoard, user);
  }

  @Head('/:id/team')
  isPartOfBoardTeam(
    @GetUser() user: User,
    @Param('id') idBoard: string,
  ): Promise<boolean> {
    return this.boardService.isPartOfBoardTeam(user.id, idBoard);
  }
}
