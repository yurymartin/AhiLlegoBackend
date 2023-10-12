import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DiscountCode } from '../../schemas/discountCode.schema';
import {
  CreateDiscountCodeDto,
  UpdateDiscountCodeDto,
} from '../../dtos/discountCode.dto';
import { Model, Types } from 'mongoose';
import { differenceInDays, format } from 'date-fns';
import { UserService } from '../../../users/services/user/user.service';
import { CreditService } from '../credit/credit.service';
import { CreateCreditDto } from 'src/orders/dtos/credit.dto';

@Injectable()
export class DiscountCodeService {
  constructor(
    @InjectModel(DiscountCode.name)
    private readonly discountCodeModel: Model<DiscountCode>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => CreditService))
    private readonly creditService: CreditService,
  ) {}

  async findAll() {
    let discountCodes = await this.discountCodeModel.find({}).exec();
    return discountCodes;
  }

  async getById(id: any): Promise<DiscountCode> {
    const discountCode = await this.discountCodeModel.findById(id).exec();
    if (!discountCode) {
      throw new NotFoundException(
        'El código de descuento ya no se encuentra disponible.',
      );
    }
    return discountCode;
  }

  async getActiveById(id: string): Promise<DiscountCode> {
    const dateCurrent = format(new Date(), 'yyyy-MM-dd');
    const discountCode = await this.discountCodeModel
      .findOne({
        _id: new Types.ObjectId(id),
        expirationDate: { $gte: dateCurrent },
        quantityAvailable: { $gt: 0 },
        status: true,
      })
      .exec();
    if (!discountCode) {
      throw new NotFoundException(
        'El código de descuento ya no se encuentra disponible.',
      );
    }
    return discountCode;
  }

  async getActiveByCodeAndUser(
    code: String,
    userId: string,
  ): Promise<DiscountCode> {
    const dateCurrent = format(new Date(), 'yyyy-MM-dd');
    const discountCode = await this.discountCodeModel
      .findOne({
        code: code.toUpperCase(),
        expirationDate: { $gte: dateCurrent },
        quantityAvailable: { $gt: 0 },
        status: true,
      })
      .exec();

    if (!discountCode) {
      throw new NotFoundException(
        'El código de descuento ya no se encuentra disponible.',
      );
    }

    const credit = await this.creditService.getByDiscountCodeIdAndUserId(
      discountCode._id,
      userId,
    );

    if (credit) {
      throw new NotFoundException(
        'El codigo de descuento ya fue utilizado por usted. intente con otro codigo gracias.',
      );
    }

    return discountCode;
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
    if (data.userId) {
      const user = await this.userService.findOne(data.userId);
      data.userId = user._id;
    } else {
      data.userId = null;
    }

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

  async update(id: string, changes: UpdateDiscountCodeDto) {
    const statusOrder = await this.discountCodeModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();
    if (!statusOrder) {
      throw new NotFoundException(
        `Ocurrio un error al actualiar el codigo de descuento`,
      );
    }
    return statusOrder;
  }
}
