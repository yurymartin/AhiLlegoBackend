import { IsString, IsNotEmpty, IsHash, IsOptional } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateLoginDeliveryManDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly documentNumber: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly tokenDevice: string;
}

export class UpdateLoginDeliveryManDto extends PartialType(
  CreateLoginDeliveryManDto,
) {}
