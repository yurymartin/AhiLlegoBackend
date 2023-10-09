import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCreditDto } from '../../dtos/credit.dto';
import { Credit } from '../../schemas/credit.schema';
import { DiscountCodeService } from '../discount-code/discount-code.service';
import { UserService } from '../../../users/services/user/user.service';
import { differenceInDays, format } from 'date-fns';

@Injectable()
export class CreditService {
  constructor(
    @InjectModel(Credit.name)
    private readonly creditModel: Model<Credit>,
    @Inject(forwardRef(() => DiscountCodeService))
    private readonly discountCodeService: DiscountCodeService,
    private readonly userService: UserService,
  ) {}

  async findAll() {
    let credits = await this.creditModel.find({}).exec();
    return credits;
  }

  async getByDiscountCodeIdAndUserId(
    discountCodeId: string,
    userId: string,
  ): Promise<Credit> {
    let credit = await this.creditModel
      .findOne({
        discountCodeId: new Types.ObjectId(discountCodeId),
        userId: new Types.ObjectId(userId),
        status: true,
      })
      .exec();
    return credit;
  }

  async create(data: CreateCreditDto) {
    const newCredit = new this.creditModel(data);
    const creditSave = await newCredit.save();
    if (!creditSave) {
      throw new InternalServerErrorException('Error al registrar el credito');
    }
    return creditSave;
  }

  async validateDiscountCode(data: CreateCreditDto) {
    let user = await this.userService.findOne(String(data.userId));

    let discountCode = await this.discountCodeService.findByCode(data.code);

    if (discountCode && Number(discountCode.typeUseId) === 2) {
      throw new BadRequestException(
        'Este codigo solo se puede usar al momento de confirmar un pedido.',
      );
    }

    let credit = await this.creditModel.findOne({
      userId: user._id,
      discountCodeId: discountCode._id,
    });

    if (credit) {
      throw new BadRequestException(
        'El codigo de descuento ya fue utilizado por usted. intente con otro codigo gracias.',
      );
    }

    const currentDate = format(new Date(), 'yyyy-MM-dd');
    const expirationDate = discountCode.expirationDate;
    const difference = differenceInDays(
      new Date(currentDate),
      new Date(expirationDate),
    );
    if (Number(difference) > 0) {
      throw new BadRequestException(
        'Lo siento, el código promocional ha expirado. Por favor, ingresa otro código',
      );
    }

    const quantityAvailable = Number(discountCode.quantityAvailable);
    if (quantityAvailable <= 0) {
      throw new BadRequestException(
        'Lo siento, el código promocional ha llegado al límite. Por favor, ingresa otro código',
      );
    }
    const newQuantityAvailable = quantityAvailable - 1;

    const updatediscountCodeBody = {
      quantityAvailable: newQuantityAvailable,
    };
    const updateAvariable = await this.discountCodeService.update(
      discountCode._id,
      updatediscountCodeBody,
    );

    let valueCurrent = Number(user.credit || 0) + discountCode.value;

    let bodyUpdate = {
      credit: valueCurrent,
    };

    let userUpdate = await this.userService.update(user._id, bodyUpdate);

    let bodyCreate: any = {
      discountCodeId: discountCode._id,
      userId: user._id,
    };
    let create = await this.create(bodyCreate);

    return create;
  }
}
