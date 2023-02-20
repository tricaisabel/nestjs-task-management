import {
  IsDate,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';
import { TaskPriority, TaskStatus, TaskType } from '../task.enum';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsEnum(TaskType)
  type: TaskType;

  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @IsDateString()
  deadline: string;

  @IsUUID()
  boardId: string;
}
