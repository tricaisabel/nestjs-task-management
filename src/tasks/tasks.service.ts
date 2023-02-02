import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';
import { AssignToDto } from './dto/update-task.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class TasksService {
  //inject the task repository (also added as an import)
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private authService: AuthService,
  ) {}

  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    delete found.createdBy.password;
    if (found.assignedTo) delete found.assignedTo.password;

    return found;
  }

  async getAllTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.taskRepository.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    query.leftJoinAndSelect('task.createdBy', 'user');
    const tasks = await query.getMany();

    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description, type, priority, deadline } = createTaskDto;
    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      type,
      priority,
      deadline: new Date(deadline),
      createdOn: new Date(),
      createdBy: user,
      assignedTo: null,
    });

    await this.taskRepository.save(task);
    return task;
  }

  async deleteTaskById(id: string) {
    const result = await this.taskRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
  }

  async updateTaskById(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    if (task) {
      task.status = status;
      await this.taskRepository.save(task);
      return task;
    } else {
      throw new NotFoundException("There aren't any tasks with the given id");
    }
  }

  async assignTaskById(id: string, assignToDto: AssignToDto): Promise<Task> {
    const { assignedTo } = assignToDto;
    const user: User = await this.authService.userExists(assignedTo);

    const task = await this.getTaskById(id);
    if (task) {
      task.assignedTo = user;
      await this.taskRepository.save(task);
      return task;
    } else {
      throw new NotFoundException("There aren't any tasks with the given id");
    }
  }
}
