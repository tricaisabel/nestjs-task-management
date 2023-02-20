import { IsDateString, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { TaskPriority, TaskStatus, TaskType } from '../task.enum';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}

export class AssignToDto {
  @IsUUID()
  assignedTo: string;
}

export class FullTaskUpdateDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsEnum(TaskType)
  type: TaskType;

  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsDateString()
  deadline: string;

  assignedTo: string;
}
