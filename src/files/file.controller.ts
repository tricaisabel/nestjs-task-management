import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Res,
  StreamableFile,
  UseInterceptors,
} from '@nestjs/common';
import { Readable } from 'typeorm/platform/PlatformTools';
import { FileService } from './file.service';
import { Response } from 'express';

@Controller('files')
@UseInterceptors(ClassSerializerInterceptor)
export class FileController {
  constructor(private readonly filesService: FileService) {}

  @Get(':id')
  async getDatabaseFileById(
    @Param('id') id: number,
    @Res({ passthrough: true }) response: Response,
  ) {
    const file = await this.filesService.getFileById(id);
    const stream = Readable.from(file.data);

    response.set({
      'Content-Disposition': `inline; filename="${file.filename}"`,
      'Content-Type': 'image',
    });

    return new StreamableFile(stream);
  }
}
