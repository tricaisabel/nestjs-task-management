import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileController } from './file.controller';
import DatabaseFile from './file.entity';
import { FileService } from './file.service';

@Module({
  imports: [TypeOrmModule.forFeature([DatabaseFile])],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FilesModule {}
