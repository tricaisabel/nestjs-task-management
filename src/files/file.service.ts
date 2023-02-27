import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import DatabaseFile from './file.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(DatabaseFile)
    private filesRepository: Repository<DatabaseFile>,
  ) {}

  async uploadDatabaseFile(
    dataBuffer: Buffer,
    filename: string,
  ): Promise<DatabaseFile> {
    const newFile = await this.filesRepository.create({
      filename,
      data: dataBuffer,
    });
    await this.filesRepository.save(newFile);
    return newFile;
  }

  async getFileById(fileId: number) {
    const file = await this.filesRepository.findOne(fileId);
    if (!file) {
      throw new NotFoundException();
    }
    return file;
  }
}
