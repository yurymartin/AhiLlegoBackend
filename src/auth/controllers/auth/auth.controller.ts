import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CreateRegisterCustomerDto } from '../../dtos/registerCustomer.dto';
import { User } from '../../../users/schemas/user.schema';
import { AuthService } from '../../services/auth/auth.service';
import { CreateSignInCustomerDto } from '../../dtos/signInCustomer.dto';
import { CreateDeliveryManDto } from '../../dtos/deliveryMan.dto';
import { CreateLoginDeliveryManDto } from '../../dtos/deliveryManLogin.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req: Request) {
    const user = req.user as User;
    return this.authService.generateJWT(user);
  }

  @Post('login/delivery-man')
  loginDeliveryMan(@Body() data: CreateLoginDeliveryManDto) {
    return this.authService.loginDeliveryMan(data);
  }

  @Post('login/enterprise')
  loginEnterprise(@Body() data: CreateLoginDeliveryManDto) {
    return this.authService.loginEnterprise(data);
  }

  // @UseGuards(AuthGuard('local'))
  @Post('signin/customer')
  loginCustomer(@Body() data: CreateSignInCustomerDto) {
    return this.authService.signInCustomer(data);
  }

  @Post('register/customer')
  registerCustomer(@Body() data: CreateRegisterCustomerDto) {
    return this.authService.createCustomer(data);
  }

  @Post('register/delivery-man')
  registerDeliveryMan(@Body() data: CreateDeliveryManDto) {
    return this.authService.createDeliveryMan(data);
  }
}
