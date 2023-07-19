import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DiscountCode } from '../../schemas/discountCode.schema';
import { CreateDiscountCodeDto } from '../../dtos/discountCode.dto';
import { Model } from 'mongoose';
import { differenceInDays, format } from 'date-fns';

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
    let searchCode = await this.discountCodeModel.findOne({
      code: data.code,
    });

    if (searchCode) {
      const currentDate = format(new Date(), 'yyyy-MM-dd');
      const expirationDate = searchCode.expirationDate;
      const difference = differenceInDays(
        new Date(currentDate),
        new Date(expirationDate),
      );
      if (Number(difference) > 0) {
        throw new BadRequestException(
          'Código promocional expirado. Contáctanos al administrador para renovar su fecha de expiración.',
        );
      } else {
        throw new BadRequestException(
          'El codigo de descuento ingresado ya existe y se encuentra vigente',
        );
      }
    }

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
