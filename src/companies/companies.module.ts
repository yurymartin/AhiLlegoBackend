import { Module } from '@nestjs/common';
import { BusinessLineService } from './services/business-line/business-line.service';
import { BusinessLineController } from './controllers/business-line/business-line.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BusinessLine,
  BusinessLineSchema,
} from './schemas/businessLine.schema';
import { BusinessLineDetailController } from './controllers/business-line-detail/business-line-detail.controller';
import { BusinessLineDetailService } from './services/business-line-detail/business-line-detail.service';
import {
  BusinessLineDetail,
  BusinessLineDetailSchema,
} from './schemas/businessLineDetail.schema';
import { Company, CompanySchema } from './schemas/company.schema';
import { UsersModule } from '../users/users.module';
import { CompanyController } from './controllers/company/company.controller';
import { CompanyService } from './services/company/company.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BusinessLine.name,
        schema: BusinessLineSchema,
      },
      {
        name: BusinessLineDetail.name,
        schema: BusinessLineDetailSchema,
      },
      {
        name: Company.name,
        schema: CompanySchema,
      },
    ]),
    UsersModule,
  ],
  providers: [BusinessLineService, BusinessLineDetailService, CompanyService],
  controllers: [
    BusinessLineController,
    BusinessLineDetailController,
    CompanyController,
  ],
  exports: [CompanyService],
})
export class CompaniesModule {}
