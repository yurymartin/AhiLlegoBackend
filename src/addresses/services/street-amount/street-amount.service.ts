import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateStreetAmountDto } from '../../dtos/streetAmount.dto';
import { StreetAmount } from '../../schemas/streetAmount.schema';
import { SettingService } from '../../../settings/services/setting/setting.service';
import { CODE_SETTING_AMOUNT_DELIVERY_DEFAULT } from '../../../common/constants';
import { StreetService } from '../street/street.service';
import { AddressCompanyService } from '../address-company/address-company.service';
import { CompanyService } from '../../../companies/services/company/company.service';
import { AddressService } from '../address/address.service';
import { catchError, lastValueFrom, map } from 'rxjs';
import { DistanceAmountService } from '../distance-amount/distance-amount.service';
import { MapsService } from '../../../google/services/maps/maps.service';

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
    private readonly googleMapsService: MapsService,
    private readonly distanceAmountService: DistanceAmountService,
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
    const addressCompany = await this.addressCompanyService.findByCompanyId(
      companyId,
    );
    if (!addressCompany) {
      throw new NotFoundException('La empresa no tiene una dirección activa');
    }

    const addressUser = await this.addressService.findOneActiveByUserId(userId);
    if (!addressUser) {
      throw new NotFoundException('El usuario no tiene una dirección activa');
    }

    const distanceGoogleMaps = await this.getDistanceMatrix(
      new Types.ObjectId(userId),
      new Types.ObjectId(companyId),
    );

    let streetAmount = { amount: 0 };
    let deliveryAmount = await this.calculateAmountDelivery(distanceGoogleMaps);

    if (!deliveryAmount) {
      let amountDefault = await this.settingService.findByCode(
        CODE_SETTING_AMOUNT_DELIVERY_DEFAULT,
      );
      if (!amountDefault) {
        streetAmount = { amount: 5 };
      }
      streetAmount = { amount: 5 };
    }

    streetAmount = { amount: deliveryAmount };
    return streetAmount;
  }

  async getDistanceMatrix(userId: any, companyId: any) {
    let addressCompany = await this.addressCompanyService.findByCompanyId(
      companyId,
    );
    if (!addressCompany) {
      throw new NotFoundException('La empresa no tiene una dirección activa');
    }

    let addressUser = await this.addressService.findOneActiveByUserId(userId);
    if (!addressUser) {
      throw new NotFoundException('El usuario no tiene una dirección activa');
    }
    const origin = `${addressCompany.coordinates.latitude}, ${addressCompany.coordinates.longitude}`;
    const destination = `${addressUser.coordinates.latitude}, ${addressUser.coordinates.longitude}`;

    let result = this.googleMapsService
      .getDistanceMatrix(origin, destination)
      .pipe(
        map((res) => {
          return res.data;
        }),
      )
      .pipe(
        catchError(() => {
          throw new ForbiddenException('API not available');
        }),
      );

    return lastValueFrom(result);
  }

  async calculateAmountDelivery(responseGoogleMaps: any) {
    let distance = 1;

    if (
      responseGoogleMaps &&
      responseGoogleMaps.rows.length > 0 &&
      responseGoogleMaps.rows[0].elements.length > 0 &&
      responseGoogleMaps.rows[0].elements[0] &&
      responseGoogleMaps.rows[0].elements[0].distance &&
      responseGoogleMaps.rows[0].elements[0].distance &&
      responseGoogleMaps.rows[0].elements[0].distance.value
    ) {
      console.log(
        '[RESPONSE_GOOGLE] => ',
        responseGoogleMaps.rows[0].elements[0].distance,
      );
      distance = distance =
        responseGoogleMaps.rows[0].elements[0].distance.value;
    }
    let amount = 5;
    let distanceAmount = await this.distanceAmountService.getByDistance(
      distance,
    );
    if (distanceAmount) {
      amount = Number(distanceAmount.amount);
    }
    return amount;
  }
}
