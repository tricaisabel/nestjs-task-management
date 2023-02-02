import { User } from 'src/auth/user.entity';
import { Board } from 'src/board/board.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskPriority, TaskStatus, TaskType } from './task.enum';

@Entity()
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

  @ManyToOne((_type) => User, (user) => user.createdTasks, { eager: true })
  createdBy: User;

  @ManyToOne((_type) => User, (user) => user.assignedTasks, { eager: true })
  assignedTo: User;

  @ManyToOne((_type) => Board, (board) => board.tasks, { eager: true })
  board: Board;
}
