import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DocumentTypeService } from './../../services/document-type/document-type.service';
import {
  CreateDocumentTypeDto,
  UpdateDocumentTypeDto,
} from './../../dtos/documentType.dto';
import { MongoIdPipe } from '../../../common/pipe/mongo-id/mongo-id.pipe';

@ApiTags('document-type')
@Controller('document-type')
export class DocumentTypeController {
  constructor(private documentTypeService: DocumentTypeService) {}

  @Get()
  async findAll() {
    return await this.documentTypeService.findAll();
  }

  @Get(':id')
  async finOne(@Param('id', MongoIdPipe) id: string) {
    return await this.documentTypeService.findOne(id);
  }

  @Post()
  async create(@Body() payload: CreateDocumentTypeDto) {
    return await this.documentTypeService.create(payload);
  }

  @Put(':id')
  async update(
    @Param('id', MongoIdPipe) id: string,
    @Body() payload: UpdateDocumentTypeDto,
  ) {
    return await this.documentTypeService.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id', MongoIdPipe) id: string) {
    return await this.documentTypeService.remove(id);
  }
}
