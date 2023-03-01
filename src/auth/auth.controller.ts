import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { SignInCredentialsDto } from './dto/signin-credentials.dto';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/users')
  @UseGuards(AuthGuard())
  getAllUsers() {
    return this.authService.getUsers();
  }

  @Get('/users/:id')
  @UseGuards(AuthGuard())
  getUserById(@Param('id') id: string) {
    return this.authService.userExists(id);
  }

  @Post('/signup')
  signup(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ user: User; accessToken: string }> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signin(
    @Body() signInCredentialsDto: SignInCredentialsDto,
  ): Promise<{ user: User; accessToken: string }> {
    return this.authService.signIn(signInCredentialsDto);
  }

  @Post('avatar')
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('file'))
  async addAvatar(
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.authService.addAvatar(user.id, file.buffer, file.originalname);
  }
}
