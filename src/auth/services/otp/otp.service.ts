import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { addMinutes, format, differenceInMinutes } from 'date-fns';
import { Model } from 'mongoose';
import { Otp } from './../../schemas/otp.schema';
import { random } from './../../../common/helper/utils';
import { CreateOtpDto } from './../../dtos/otp.dto';
import { UserService } from '../../../users/services/user/user.service';

const TIME_LIMIT_EXPIRATION_SMS = 5;

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(Otp.name) private readonly otpModel: Model<Otp>,
    private userService: UserService,
  ) {}

  private readonly logger = new Logger(OtpService.name);

  async generate(data: CreateOtpDto) {
    this.logger.log('[DATA_GENERATE_OTP] =>', data);
    let code = random(4);
    let expired = format(
      addMinutes(new Date(), TIME_LIMIT_EXPIRATION_SMS),
      'yyyy-MM-dd HH:mm:ss',
    );
    let otpSearch = await this.otpModel.findOne({ phone: data.phone });
    let newOtpGenerated = {
      code,
      expired,
      phone: data.phone,
    };
    let newOtpGenerate = {};
    if (otpSearch) {
      newOtpGenerate = await this.otpModel
        .findByIdAndUpdate(
          otpSearch._id,
          { $set: newOtpGenerated },
          { new: true },
        )
        .exec();
      if (!newOtpGenerated) {
        throw new InternalServerErrorException(
          'Error al actualizar el codigo otp',
        );
      }
    } else {
      const newOtp = new this.otpModel(newOtpGenerated);
      newOtpGenerate = await newOtp.save();
      if (!newOtpGenerated) {
        throw new InternalServerErrorException(
          'Error al registrar el codigo otp',
        );
      }
    }
    return newOtpGenerate;
  }

  async validate(data: CreateOtpDto) {
    this.logger.log('[DATA_VALIDATE_OTP] =>', data);
    const { code, phone } = data;
    let userRegisted: boolean = false;
    let resultValidateCode: boolean = false;

    const otpSearch = await this.otpModel.findOne({ code, phone });
    if (!otpSearch) {
      throw new NotFoundException('Codigo de validación incorrecto');
    }
    let OtpExpired = otpSearch.expired;
    let difference = differenceInMinutes(new Date(), new Date(OtpExpired));
    if (difference > TIME_LIMIT_EXPIRATION_SMS) {
      throw new BadRequestException(
        `Codigo de validación ya se encuentra expirado`,
      );
    }
    resultValidateCode = true;
    let userSearch = await this.userService.findOneByPhone(phone);
    userRegisted = userSearch ? true : false;
    return {
      resultValidateCode,
      userRegisted,
    };
  }
}
