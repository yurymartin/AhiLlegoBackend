import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStreetAmountDto } from '../../dtos/streetAmount.dto';
import { StreetAmount } from '../../schemas/streetAmount.schema';
import { SettingService } from '../../../settings/services/setting/setting.service';
import { CODE_SETTING_AMOUNT_DELIVERY_DEFAULT } from '../../../common/constants';
import { StreetService } from '../street/street.service';
import { AddressCompanyService } from '../address-company/address-company.service';
import { CompanyService } from '../../../companies/services/company/company.service';
import { AddressService } from '../address/address.service';

@Injectable()
export class StreetAmountService {
  constructor(
    @InjectModel(StreetAmount.name)
    private readonly streetAmountModel: Model<StreetAmount>,
    private streetService: StreetService,
    private addressService: AddressService,
    private settingService: SettingService,
    private addressCompanyService: AddressCompanyService,
    @Inject(forwardRef(() => CompanyService))
    private companyService: CompanyService,
  ) {}
  async findAll() {
    let res = await this.streetAmountModel.find({}).exec();
    return res;
  }

  async create(data: CreateStreetAmountDto) {
    let streetOrigin = await this.streetService.findOne(
      data.streetOriginId.toString(),
    );

    data.streetOriginId = streetOrigin;

    let streetDestination = await this.streetService.findOne(
      data.streetDestinationId.toString(),
    );

    data.streetDestinationId = streetDestination;

    const newStreetAmount = new this.streetAmountModel(data);
    const streetAmountSave = await newStreetAmount.save();
    if (!streetAmountSave) {
      throw new InternalServerErrorException(
        'Error al registrar el monto de direcciones',
      );
    }
    return streetAmountSave;
  }

  async findAmountDelivery(userId: string, companyId: string) {
    let addressCompany = await this.addressCompanyService.findByCompanyId(
      companyId,
    );
    let addressUser = await this.addressService.findOneActiveByUserId(userId);
    if (!addressUser) {
      throw new NotFoundException('El usuario no tiene una dirección activa');
    }
    let filter = {
      streetOriginId: addressCompany.streetId,
      streetDestinationId: addressUser.streetId,
    };
    let streetAmount = await this.streetAmountModel.findOne(filter);
    if (!streetAmount) {
      let amountDefault = await this.settingService.findByCode(
        CODE_SETTING_AMOUNT_DELIVERY_DEFAULT,
      );
      if (!amountDefault) {
        throw new BadRequestException(
          'No se encontro el monto de delivery por defecto',
        );
      }
      return { amount: amountDefault.value };
    }
    return streetAmount;
  }
}
