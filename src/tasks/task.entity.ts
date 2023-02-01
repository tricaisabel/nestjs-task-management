import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TaskPriority, TaskStatus, TaskType } from './task.enum';

@Entity('Task')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @Column()
  type: TaskType;

  @Column()
  priority: TaskPriority;

  @Column()
  deadline: Date;

  @Column()
  createdOn: Date;
}
