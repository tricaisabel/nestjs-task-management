import { User } from 'src/auth/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Board {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  title: string;

  @ManyToOne((_type) => User, (user) => user.createdBoards, { eager: true })
  createdBy: User;
}
