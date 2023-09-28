import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendNotificationByProfileIdDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  readonly profileId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly message: string;
}
