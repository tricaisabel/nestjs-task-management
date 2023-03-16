import { Optional } from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateBoardDto {
  @IsNotEmpty()
  title: string;
}

export class GetBoardDto {
  @IsOptional()
  fullSet?: string;
}
