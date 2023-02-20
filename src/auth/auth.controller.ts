import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { SignInCredentialsDto } from './dto/signin-credentials.dto';
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
}
