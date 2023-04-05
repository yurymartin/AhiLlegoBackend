import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStreetDto } from '../../dtos/street.dto';
import { Street } from '../../schemas/street.schema';

@Injectable()
export class StreetService {
  constructor(
    @InjectModel(Street.name)
    private readonly streetModel: Model<Street>,
  ) {}

  async findAll() {
    const streets = await this.streetModel.find().exec();
    return streets;
  }

  async findOne(id: string) {
    const street = await this.streetModel.findOne({ _id: id });
    if (!street) {
      throw new NotFoundException('No existe el calle');
    }
    return street;
  }

  async create(data: CreateStreetDto) {
    const newStreet = new this.streetModel(data);
    const streetSave = await newStreet.save();
    if (!streetSave) {
      throw new InternalServerErrorException('Error al registrar la calle');
    }
    return streetSave;
  }
}
