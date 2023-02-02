import { Exclude } from 'class-transformer';
import { Board } from 'src/board/board.entity';
import { Task } from 'src/tasks/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
