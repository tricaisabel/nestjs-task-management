import { User } from 'src/auth/user.entity';

export const users: User[] = [
  {
    id: '1',
    username: 'Marius',
    password: 'parola mea',
    role: 'developer',
    email: 'myemail@yahoo.com',
    createdBoards: [],
    createdTasks: [],
    assignedTasks: [],
  },
  {
    id: '2',
    username: 'Maria',
    password: 'parola mea 123',
    role: 'manager',
    email: 'email@yahoo.com',
    createdBoards: [],
    createdTasks: [],
    assignedTasks: [],
  },
  {
    id: '3',
    username: 'Marta',
    password: 'parola mea 123',
    role: 'manager',
    email: 'email@yahoo.com',
    createdBoards: [],
    createdTasks: [],
    assignedTasks: [],
  },
];

export const boards = [
  {
    id: '1234',
    title: 'Board One',
    createdBy: users[0],
    tasks: ['Task one', 'Task two'],
    team: [users[1]],
  },
  {
    id: '4356',
    title: 'Board Two',
    createdBy: users[1],
    tasks: ['Task three', 'Task two'],
    team: [users[0]],
  },
];

export const newUser = {
  username: 'newUser',
  password: 'somepassword',
  email: 'user.email@yahoo.com',
  role: 'DEVELOPER',
};
