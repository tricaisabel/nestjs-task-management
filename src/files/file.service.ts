import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
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
    queryRunner: QueryRunner,
  ): Promise<DatabaseFile> {
    const newFile = queryRunner.manager.create(DatabaseFile, {
      filename,
      data: dataBuffer,
    });
    await queryRunner.manager.save(DatabaseFile, newFile);
    return newFile;
  }

  async deleteFile(fileId: number, queryRunner: QueryRunner) {
    const deleteResponse = await queryRunner.manager.delete(
      DatabaseFile,
      fileId,
    );
    if (!deleteResponse.affected) {
      throw new NotFoundException();
    }
  }

  async getFileById(fileId: number) {
    const file = await this.filesRepository.findOne(fileId);
    if (!file) {
      throw new NotFoundException();
    }
    return file;
  }
}
