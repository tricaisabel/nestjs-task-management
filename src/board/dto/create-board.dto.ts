import { IsNotEmpty, IsUUID } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateBoardDto {
  @IsNotEmpty()
  title: string;
}
