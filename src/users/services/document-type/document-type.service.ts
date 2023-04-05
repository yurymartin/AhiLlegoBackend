import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { DocumentType } from '../../schemas/documentType.shema';
import {
  CreateDocumentTypeDto,
  UpdateDocumentTypeDto,
} from '../../dtos/documentType.dto';

@Injectable()
export class DocumentTypeService {
  constructor(
    @InjectModel(DocumentType.name)
    private readonly documentTypeModel: Model<DocumentType>,
  ) {}

  async findAll() {
    const documentTypes = await this.documentTypeModel
      .find()
      .select('-createdAt -updatedAt -__v')
      .exec();
    return documentTypes;
  }

  async findOne(id: string) {
    const documentType = await this.documentTypeModel
      .findOne({ _id: id })
      .select('-createdAt -updatedAt -__v')
      .exec();
    if (!documentType) {
      throw new NotFoundException(`No se encontro el tipo de documento`);
    }
    return documentType;
  }

  async create(data: CreateDocumentTypeDto) {
    const newDocumentType = new this.documentTypeModel(data);
    const documentTypeSave = await newDocumentType.save();
    return documentTypeSave;
  }

  async update(id: string, changes: UpdateDocumentTypeDto) {
    const documentType = await this.documentTypeModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();
    if (!documentType) {
      throw new NotFoundException(`No se encontro el tipo de documento`);
    }
    return documentType;
  }

  async remove(id: string) {
    const documentType = await this.documentTypeModel
      .findOne({ _id: id })
      .exec();
    if (!documentType) {
      throw new NotFoundException(`No se encontro el tipo de producto`);
    }
    const documentTypeRemove = await this.documentTypeModel.findByIdAndDelete(
      id,
    );
    return documentTypeRemove;
  }
}
