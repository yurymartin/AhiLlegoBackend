import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateOtpDto } from './../../dtos/otp.dto';
import { OtpService } from './../../services/otp/otp.service';

@ApiTags('otp')
@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('/generate')
  async generate(@Body() payload: CreateOtpDto) {
    return await this.otpService.generate(payload);
  }

  @Post('/verification')
  async verification(@Body() payload: CreateOtpDto) {
    return await this.otpService.verification(payload);
  }
}
