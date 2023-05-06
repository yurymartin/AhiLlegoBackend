import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  calificationI,
  confirmDeliveredClient,
  CreateChangeStatusOrderDto,
  CreateTakeOrderDto,
} from '../../dtos/deliveryMan.dto';
import { MongoIdPipe } from '../../../common/pipe/mongo-id/mongo-id.pipe';
import { CreateOrderDto } from '../../dtos/order.dto';
import { OrderService } from '../../services/order/order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async findAll() {
    return await this.orderService.findAll();
  }

  @Get('/filter')
  async findByFilters(
    @Query('statusOrderId') statusOrderId: string,
    @Query('deliveryManId') deliveryManId: string,
    @Query('companyId') companyId: string,
    @Query('createdAtStart') createdAtStart: string,
    @Query('createdAtEnd') createdAtEnd: string,
  ) {
    return await this.orderService.findByFilters(
      statusOrderId,
      deliveryManId,
      companyId,
      createdAtStart,
      createdAtEnd,
    );
  }

  @Get('/available')
  async findAllAvailable() {
    return await this.orderService.findAllAvailable();
  }

  @Get(':id')
  async findOne(@Param('id', MongoIdPipe) id: string) {
    return await this.orderService.findOne(id);
  }

  @Get('user/:id')
  async findByUserId(@Param('id', MongoIdPipe) id: string) {
    return await this.orderService.findByUserId(id);
  }

  @Get('search/:statusOrderId/:deliveryManId')
  async search(
    @Param('statusOrderId', MongoIdPipe) statusOrderId: string,
    @Param('deliveryManId', MongoIdPipe) deliveryManId: string,
  ) {
    return await this.orderService.search(statusOrderId, deliveryManId);
  }

  @Get('list-pending/delivery-man/:deliveryManId')
  async getPendingByDeliveryManId(
    @Param('deliveryManId', MongoIdPipe) deliveryManId: string,
  ) {
    return await this.orderService.getPendingByDeliveryManId(deliveryManId); //
  }

  @Get('/earnings/deliveryMan/month-current/:id/')
  async getEarningsByDeliveryManIdAndMonth(
    @Param('id', MongoIdPipe) id: string,
  ) {
    return await this.orderService.getEarningsByDeliveryManId(id);
  }

  @Post()
  async create(@Body() payload: CreateOrderDto) {
    return await this.orderService.create(payload);
  }

  @Post('/take-order/delivery-man')
  async takeOrderByDeliveryMan(@Body() payload: CreateTakeOrderDto) {
    return await this.orderService.TakeOrderByDeliveryMan(payload);
  }

  @Patch('/change-status')
  async changeStatusByOrderId(@Body() payload: CreateChangeStatusOrderDto) {
    return await this.orderService.changeStatusByOrderId(payload);
  }

  @Patch('/confirm/delivered/client')
  async confirmDeliveredClient(@Body() payload: confirmDeliveredClient) {
    return await this.orderService.confirmDeliveredClient(payload);
  }

  @Patch('/calification')
  async calification(@Body() payload: calificationI) {
    return await this.orderService.calification(payload);
  }
}
