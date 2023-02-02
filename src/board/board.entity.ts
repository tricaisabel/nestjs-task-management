import { User } from 'src/auth/user.entity';
import { Task } from 'src/tasks/task.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Board {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  title: string;

  @ManyToOne((_type) => User, (user) => user.createdBoards, { eager: true })
  createdBy: User;

  @ManyToMany(() => User)
  @JoinTable({ name: 'team' })
  team: User[];

  @OneToMany((_type) => Task, (task) => task.board, { eager: false })
  tasks: Task[];
}
