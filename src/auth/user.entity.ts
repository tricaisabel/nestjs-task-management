import { stringify } from 'querystring';
import { Task } from 'src/tasks/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  role: string;

  @OneToMany((_type) => Task, (task) => task.createdBy, { eager: false })
  createdTasks: Task[];

  @OneToMany((_type) => Task, (task) => task.assignedTo, { eager: false })
  assignedTasks: Task[];
}
