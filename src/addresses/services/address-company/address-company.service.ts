import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AddressCompany } from '../../schemas/addressCompany.schema';
import { CreateAddressCompanyDto } from '../../dtos/addressCompany.dto';
import { StreetService } from '../street/street.service';
import { CompanyService } from '../../../companies/services/company/company.service';

@Injectable()
export class AddressCompanyService {
  constructor(
    @InjectModel(AddressCompany.name)
    private readonly addressCompanyModel: Model<AddressCompany>,
    private readonly streetService: StreetService,
    @Inject(forwardRef(() => CompanyService))
    private companyService: CompanyService,
  ) {}

  async findByCompanyId(companyId: string): Promise<AddressCompany | any> {
    let company = await this.companyService.findOne(companyId);

    const address = await this.addressCompanyModel
      .findOne({ companyId: company._id })
      .exec();
    if (!address) {
      throw new NotFoundException('No se encontro la dirección de la empresa');
    }
    return address;
  }

  async create(data: CreateAddressCompanyDto) {
    const company = await this.companyService.findOne(
      data.companyId.toString(),
    );

    const street = await this.streetService.findOne(data.streetId.toString());

    data.companyId = company;
    data.streetId = street;

    const newAddressCompany = new this.addressCompanyModel(data);
    const addressCompanySave = await newAddressCompany.save();
    if (!addressCompanySave) {
      throw new InternalServerErrorException(
        'Error al registrar la dirección de la empresa',
      );
    }
    return addressCompanySave;
  }
}
