import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DiscountCode } from '../../schemas/discountCode.schema';
import { CreateDiscountCodeDto } from '../../dtos/discountCode.dto';
import { Model } from 'mongoose';

@Injectable()
export class DiscountCodeService {
  constructor(
    @InjectModel(DiscountCode.name)
    private readonly discountCodeModel: Model<DiscountCode>,
  ) {}

  async findAll() {
    let discountCodes = await this.discountCodeModel.find({}).exec();
    return discountCodes;
  }

  async findByCode(code: string) {
    let discountCode = await this.discountCodeModel
      .findOne({ code: code })
      .exec();
    if (!discountCode) {
      throw new NotFoundException('No existe el codigo de descuento');
    }
    return discountCode;
  }

  async create(data: CreateDiscountCodeDto) {
    const newDiscountCode = new this.discountCodeModel(data);
    const discountCodeSave = await newDiscountCode.save();
    if (!discountCodeSave) {
      throw new InternalServerErrorException(
        'Error al registrar el codigo de descuento',
      );
    }
    return discountCodeSave;
  }
}
