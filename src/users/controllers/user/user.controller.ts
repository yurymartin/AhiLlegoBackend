import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './../../services/user/user.service';
import { CreateUserDto, UpdateUserDto } from './../../dtos/user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { MongoIdPipe } from '../../../common/pipe/mongo-id/mongo-id.pipe';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('')
  async finAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  async finOne(@Param('id', MongoIdPipe) id: string) {
    return await this.userService.findOne(id);
  }

  @Get('/list/delivery-man')
  async findAllDeliveryMan() {
    return await this.userService.findAllDeliveryMan();
  }

  @Get('/address/:id')
  async findOneWithAddress(@Param('id', MongoIdPipe) id: string) {
    return await this.userService.findOneWithAddress(id);
  }
}
