import { Module } from '@nestjs/common';
import { TypePayService } from './services/type-pay/type-pay.service';
import { TypePayController } from './controllers/type-pay/type-pay.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TypePay, TypePaySchema } from './schemas/typePay.schema';
import { StatusOrderService } from './services/status-order/status-order.service';
import { StatusOrderController } from './controllers/status-order/status-order.controller';
import { StatusOrder, StatusOrderSchema } from './schemas/statusOrder.schema';
import { OrderService } from './services/order/order.service';
import { OrderController } from './controllers/order/order.controller';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrderDetail, OrderDetailSchema } from './schemas/orderDetail.schema';
import {
  DiscountCode,
  DiscountCodeSchema,
} from './schemas/discountCode.schema';
import { CompaniesModule } from '../companies/companies.module';
import { UsersModule } from '../users/users.module';
import { OrderDetailService } from './services/order-detail/order-detail.service';
import { ProductsModule } from '../products/products.module';
import { AddressesModule } from '../addresses/addresses.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { DiscountCodeService } from './services/discount-code/discount-code.service';
import { DiscountCodeController } from './controllers/discount-code/discount-code.controller';
import { CreditController } from './controllers/credit/credit.controller';
import { CreditService } from './services/credit/credit.service';
import { Credit, CreditSchema } from './schemas/credit.schema';
import { HttpModule } from '@nestjs/axios';
import { GoogleModule } from '../google/google.module';
import { Promotion, PromotionSchema } from './schemas/promotion.schema';
import { PromotionController } from './controllers/promotion/promotion.controller';
import { PromotionService } from './services/promotion/promotion.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TypePay.name,
        schema: TypePaySchema,
      },
      {
        name: StatusOrder.name,
        schema: StatusOrderSchema,
      },
      {
        name: Order.name,
        schema: OrderSchema,
      },
      {
        name: OrderDetail.name,
        schema: OrderDetailSchema,
      },
      {
        name: DiscountCode.name,
        schema: DiscountCodeSchema,
      },
      {
        name: Credit.name,
        schema: CreditSchema,
      },
      {
        name: Promotion.name,
        schema: PromotionSchema,
      },
    ]),
    CompaniesModule,
    UsersModule,
    ProductsModule,
    GoogleModule,
    AddressesModule,
    FirebaseModule,
    HttpModule,
  ],
  providers: [
    TypePayService,
    StatusOrderService,
    OrderService,
    OrderDetailService,
    DiscountCodeService,
    CreditService,
    PromotionService,
  ],
  controllers: [
    TypePayController,
    StatusOrderController,
    OrderController,
    DiscountCodeController,
    CreditController,
    PromotionController,
  ],
})
export class OrdersModule {}
