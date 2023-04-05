import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateSignInCustomerDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly phone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly tokenDevice: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly code: string;
}

export class UpdateSignInCustomerDto extends PartialType(
  CreateSignInCustomerDto,
) {}
