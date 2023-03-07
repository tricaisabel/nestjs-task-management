import { Exclude } from 'class-transformer';
import { Board } from '../board/board.entity';
import DatabaseFile from '../files/file.entity';
import { Task } from '../tasks/task.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column()
  email: string;

  @Column()
  role: string;

  @OneToMany((_type) => Task, (task) => task.createdBy, { eager: false })
  createdTasks: Task[];

  @OneToMany((_type) => Task, (task) => task.assignedTo, { eager: false })
  assignedTasks: Task[];

  @OneToMany((_type) => Task, (task) => task.createdBy, { eager: false })
  createdBoards: Board[];

  @JoinColumn({ name: 'avatarId' })
  @OneToOne(() => DatabaseFile, {
    nullable: true,
  })
  public avatar?: DatabaseFile;

  @Column({ nullable: true })
  public avatarId?: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
