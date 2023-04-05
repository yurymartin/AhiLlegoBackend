import { IsNotEmpty, IsOptional, IsBoolean, IsMongoId } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { TypeProduct } from '../schemas/typeProduct.schema';
import { Company } from 'src/companies/schemas/company.schema';

export class CreateTypeProductCompanyDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  typeProductId: string | TypeProduct;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  companyId: string | Company;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  readonly status: boolean;
}

export class UpdateTypeProductCompanyDto extends PartialType(
  CreateTypeProductCompanyDto,
) {}
