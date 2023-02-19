import {
  IsEmail,
  IsEnum,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRoles } from '../auth.enum';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  password: string;

  @IsEnum(UserRoles)
  role: string;

  @IsEmail()
  email: string;
}
