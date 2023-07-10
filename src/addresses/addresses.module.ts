import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeAddress, TypeAddressSchema } from './schemas/typeAddress.schema';
import { Address, AddressSchema } from './schemas/address.schema';
import { TypeAddressService } from './services/type-address/type-address.service';
import { TypeAddressController } from './controllers/type-address/type-address.controller';
import { AddressService } from './services/address/address.service';
import { AddressController } from './controllers/address/address.controller';
import { UsersModule } from '../users/users.module';
import { StreetController } from './controllers/street/street.controller';
import { StreetService } from './services/street/street.service';
import { Street, StreetSchema } from './schemas/street.schema';
import { StreetAmountController } from './controllers/street-amount/street-amount.controller';
import { StreetAmountService } from './services/street-amount/street-amount.service';
import {
  StreetAmount,
  StreetAmountSchema,
} from './schemas/streetAmount.schema';
import { SettingsModule } from '../settings/settings.module';
import { AddressCompanyService } from './services/address-company/address-company.service';
import { AddressCompanyController } from './controllers/address-company/address-company.controller';
import { CompaniesModule } from '../companies/companies.module';
import {
  AddressCompany,
  AddressCompanySchema,
} from './schemas/addressCompany.schema';
import {
  DistanceAmount,
  DistanceAmountSchema,
} from './schemas/distanceAmount.schema';
import { DistanceAmountService } from './services/distance-amount/distance-amount.service';
import { DistanceAmountController } from './controllers/distance-amount/distance-amount.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TypeAddress.name,
        schema: TypeAddressSchema,
      },
      {
        name: Address.name,
        schema: AddressSchema,
      },
      {
        name: Street.name,
        schema: StreetSchema,
      },
      {
        name: StreetAmount.name,
        schema: StreetAmountSchema,
      },
      {
        name: AddressCompany.name,
        schema: AddressCompanySchema,
      },
      {
        name: DistanceAmount.name,
        schema: DistanceAmountSchema,
      },
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => CompaniesModule),
    SettingsModule,
  ],
  providers: [
    TypeAddressService,
    AddressService,
    StreetService,
    StreetAmountService,
    AddressCompanyService,
    DistanceAmountService,
  ],
  controllers: [
    TypeAddressController,
    AddressController,
    StreetController,
    StreetAmountController,
    AddressCompanyController,
    DistanceAmountController,
  ],
  exports: [
    AddressService,
    StreetAmountService,
    AddressCompanyService,
    DistanceAmountService,
  ],
})
export class AddressesModule {}
