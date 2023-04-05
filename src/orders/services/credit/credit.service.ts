import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCreditDto } from '../../dtos/credit.dto';
import { Credit } from '../../schemas/credit.schema';
import { DiscountCodeService } from '../discount-code/discount-code.service';
import { UserService } from '../../../users/services/user/user.service';

@Injectable()
export class CreditService {
  constructor(
    @InjectModel(Credit.name)
    private readonly creditModel: Model<Credit>,
    private readonly discountCodeService: DiscountCodeService,
    private readonly userService: UserService,
  ) {}

  async findAll() {
    let credits = await this.creditModel.find({}).exec();
    return credits;
  }

  async create(data: CreateCreditDto) {
    const newCredit = new this.creditModel(data);
    const creditSave = await newCredit.save();
    if (!creditSave) {
      throw new InternalServerErrorException('Error al registrar el credito');
    }
    return creditSave;
  }

  async createByCode(data: CreateCreditDto) {
    let user = await this.userService.findOne(String(data.userId));

    let discountCode = await this.discountCodeService.findByCode(data.code);

    let credit = await this.creditModel.findOne({
      userId: user._id,
      discountCodeId: discountCode._id,
    });

    if (credit) {
      throw new BadRequestException(
        'El codigo de descuento ya fue utilizado por usted. intente con otro codigo gracias.',
      );
    }

    let valueCurrent = Number(user.credit || 0) + discountCode.value;

    let bodyUpdate = {
      credit: valueCurrent,
    };

    let userUpdate = this.userService.update(user._id, bodyUpdate);

    let bodyCreate: any = {
      discountCodeId: discountCode._id,
      userId: user._id,
    };
    let create = await this.create(bodyCreate);

    return create;
  }
}
