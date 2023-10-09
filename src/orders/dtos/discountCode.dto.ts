import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsDateString,
  MaxLength,
  MinLength,
  IsMongoId,
  IsIn,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { User } from '../../users/schemas/user.schema';
import {
  TYPE_DISCOUNT_CODE_PERCENTAGE,
  TYPE_DISCOUNT_CODE_QUANTITY,
} from '../../common/constants';

export class CreateDiscountCodeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(20)
  @MinLength(5)
  readonly code: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly value: number;

  @IsIn([TYPE_DISCOUNT_CODE_QUANTITY, TYPE_DISCOUNT_CODE_PERCENTAGE])
  @IsNotEmpty()
  @ApiProperty()
  readonly type: string;

  //? 1 => Agregar Creditos
  //? 2 => Descuento al momento de realizar pedidos
  @IsIn([1, 2])
  @IsNotEmpty()
  @ApiProperty()
  readonly typeUseId: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly description: string;

  @IsMongoId()
  @IsOptional()
  @ApiProperty()
  userId: User | string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly quantityAvailable: number;

  @IsDateString({ strict: true } as any)
  @IsNotEmpty()
  @ApiProperty()
  readonly expirationDate: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  readonly status: boolean;
}

export class UpdateDiscountCodeDto extends PartialType(CreateDiscountCodeDto) {}
