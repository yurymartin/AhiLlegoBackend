import {
  IsNotEmpty,
  IsMongoId,
  IsOptional,
  IsNumber,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateTakeOrderDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  deliveryManId: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  orderId: string;
}

export class UpdateTakeOrderDto extends PartialType(CreateTakeOrderDto) {}

export class CreateChangeStatusOrderDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  statusOrderId: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  orderId: string;
}

export class UpdateChangeStatusOrderDto extends PartialType(
  CreateChangeStatusOrderDto,
) {}

export class confirmDeliveredClient {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  orderId: string;
}

export class calificationI {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  orderId: string;

  @IsNumber()
  @Max(5)
  @Min(1)
  @IsNotEmpty()
  @ApiProperty()
  calification: number;
}
