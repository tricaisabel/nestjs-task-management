import { IsEnum, IsUUID } from 'class-validator';
import { TaskStatus } from '../task.enum';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}

export class AssignToDto {
  @IsUUID()
  assignedTo: string;
}
