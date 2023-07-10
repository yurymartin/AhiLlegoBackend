import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserService } from '../../../users/services/user/user.service';
import { CompanyService } from '../../../companies/services/company/company.service';
import { CreateOrderDto } from '../../dtos/order.dto';
import { Order } from '../../schemas/order.schema';
import { TypePayService } from '../type-pay/type-pay.service';
import { ProductService } from '../../../products/services/product/product.service';
import { format, lastDayOfMonth } from 'date-fns';
import { StreetAmountService } from '../../../addresses/services/street-amount/street-amount.service';
import { StatusOrderService } from '../status-order/status-order.service';
import { OrderDetailService } from '../order-detail/order-detail.service';
import {
  COMMISSION_APP_PERCENTAGE,
  COMMISSION_DEALER_PERCENTAGE,
  STEP_STATUS_PENDING,
  PROFILE_DELIVERY_MAN_ID,
  STATUS_ORDER_PENDING_ID,
  STATUS_ORDER_PROCESSING_ID,
  STATUS_ORDER_ON_ROUTE_ID,
  STATUS_ORDER_FINALIZED_ID,
  STATUS_ORDER_CANCELLED_ID,
} from '../../../common/constants';
import { AddressService } from '../../../addresses/services/address/address.service';
import {
  calificationI,
  confirmDeliveredClient,
  CreateChangeStatusOrderDto,
  CreateTakeOrderDto,
} from '../../dtos/deliveryMan.dto';
import { PushNotificationService } from '../../../firebase/services/push-notification/push-notification.service';
import { filterOrderInterface } from 'src/orders/interface/order.interface';
import { GoogleMapsService } from '../google-maps/google-maps.service';
import { AddressCompanyService } from '../../../addresses/services/address-company/address-company.service';
import { catchError, lastValueFrom, map } from 'rxjs';
import { DistanceAmountService } from '../../../addresses/services/distance-amount/distance-amount.service';

const IGV_PORCENTAGE = 0.18;

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
    private readonly companyService: CompanyService,
    private readonly typePayService: TypePayService,
    private readonly userService: UserService,
    private readonly productService: ProductService,
    private readonly streetAmountService: StreetAmountService,
    private readonly statusOrderService: StatusOrderService,
    private readonly orderDetailService: OrderDetailService,
    private readonly googleMapsService: GoogleMapsService,
    private readonly addressService: AddressService,
    private readonly addressCompanyService: AddressCompanyService,
    private readonly distanceAmountService: DistanceAmountService,
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  private readonly logger = new Logger(OrderService.name);

  async findAll() {
    let orders = await this.orderModel
      .find()
      .select('-createdAt -updatedAt -__v')
      .exec();
    return orders;
  }

  async findByFilters(
    statusOrderId: string,
    deliveryManId: string,
    companyId: string,
    createdAtStart: string,
    createdAtEnd: string,
  ) {
    let filters: filterOrderInterface = {};
    if (statusOrderId) {
      filters.statusOrderId = new Types.ObjectId(statusOrderId);
    }
    if (deliveryManId) {
      filters.deliveryManId = new Types.ObjectId(deliveryManId);
    }
    if (companyId) {
      filters.companyId = new Types.ObjectId(companyId);
    }
    if (createdAtStart && createdAtEnd) {
      filters.createdAt = { $gte: createdAtStart, $lte: createdAtEnd };
    }
    console.log('filters =>', filters);
    let orders = await this.orderModel
      .find(filters)
      .sort({ date: -1 })
      .populate(
        'companyId statusOrderId deliveryManId typePayId userId',
        '-createdAt -updatedAt -__v -password -profileId',
      )
      .exec();
    return orders;
  }

  async findOne(id: string) {
    const order = await this.orderModel
      .findOne({ _id: id })
      .sort({ date: -1 })
      .populate(
        'companyId statusOrderId deliveryManId typePayId userId deliveryManId',
        '-createdAt -updatedAt -__v -password -profileId',
      );
    if (!order) {
      throw new NotFoundException(`No se encontro el pedido`);
    }
    let detail = await this.orderDetailService.findByOrderId(order._id);
    let response = {
      order: order,
      detail: detail,
    };
    return response;
  }

  async findAllAvailable() {
    let status = await this.statusOrderService.findByStep(1);
    let orders = await this.orderModel
      .find({ statusOrderId: status._id })
      .sort({ date: -1 })
      .populate(
        'companyId statusOrderId deliveryManId typePayId userId',
        '-createdAt -updatedAt -__v -password -profileId',
      )
      .select('-createdAt -updatedAt -__v')
      .exec();
    return orders;
  }

  async findByUserId(id: string) {
    let user = await this.userService.findOne(id);

    let orders = await this.orderModel
      .find({ userId: user._id })
      .sort({ date: -1 })
      .populate('companyId statusOrderId deliveryManId typePayId', '-__v')
      .select('-__v')
      .exec();
    return orders;
  }

  async search(statusOrderId: string, deliveryManId: string) {
    let user = await this.userService.findOne(deliveryManId);

    let status = await this.statusOrderService.findOne(statusOrderId);

    let orders = await this.orderModel
      .find({ statusOrderId: status._id, deliveryManId: user._id })
      .sort({ date: -1 })
      .populate(
        'companyId statusOrderId deliveryManId typePayId userId',
        '-createdAt -updatedAt -__v -password -profileId',
      )
      .select('-createdAt -updatedAt -__v')
      .exec();
    return orders;
  }

  async getPendingByDeliveryManId(deliveryManId: string) {
    let user = await this.userService.findOne(deliveryManId);

    let orders = await this.orderModel
      .find({
        $and: [
          { deliveryManId: user._id },
          {
            $or: [
              { statusOrderId: new Types.ObjectId(STATUS_ORDER_PENDING_ID) },
              { statusOrderId: new Types.ObjectId(STATUS_ORDER_PROCESSING_ID) },
              { statusOrderId: new Types.ObjectId(STATUS_ORDER_ON_ROUTE_ID) },
            ],
          },
        ],
      })
      .sort({ date: -1 })
      .populate(
        'companyId statusOrderId deliveryManId typePayId userId',
        '-createdAt -updatedAt -__v -password -profileId',
      )
      .select('-createdAt -updatedAt -__v')
      .exec();
    return orders;
  }

  async getEarningsByDeliveryManId(deliveryManId: string) {
    let user = await this.userService.findOne(deliveryManId);

    const dateCurrentMonth = `${format(new Date(), 'yyyy-MM')}-01`;
    const lastDateOfMonth = format(lastDayOfMonth(new Date()), 'yyyy-MM-dd');

    let orders = await this.orderModel.find({
      deliveryManId: user._id,
      statusOrderId: new Types.ObjectId(STATUS_ORDER_FINALIZED_ID),
      dateDelivery: { $gte: dateCurrentMonth, $lte: lastDateOfMonth },
    });
    let amountEarnings = 0;
    if (orders && orders.length > 0) {
      orders.forEach((element) => {
        amountEarnings = amountEarnings + element.commissionDeliveryMan;
      });
    }
    return {
      month: format(new Date(), 'MMMM'),
      amountEarnings,
    };
  }

  async create(data: CreateOrderDto) {
    this.logger.log('[REQUEST ORDER] =>', data);
    let company = await this.companyService.findOne(data.companyId);
    let typePay = await this.typePayService.findOne(String(data.typePayId));
    let user = await this.userService.findOne(String(data.userId));
    let addressRes = await this.addressService.findOne(String(data.addressId));

    const distanceGoogleMaps = await this.getDistanceMatrix(
      user._id,
      company._id,
    );

    let deliveryAmount = await this.calculateAmountDelivery(distanceGoogleMaps);

    // let deliveryAmount = await this.streetAmountService.findAmountDelivery(
    //   String(data.userId),
    //   String(data.companyId),
    // );
    let bodyUpdateCredit = {
      credit: 0,
    };

    let deliveryAmountBackup: number = Number(deliveryAmount);
    if (user && user.credit && Number(user.credit) > 0) {
      if (Number(user.credit) > Number(deliveryAmount)) {
        bodyUpdateCredit.credit = Number(user.credit) - Number(deliveryAmount);
        deliveryAmount = 0;
      } else {
        deliveryAmount = Number(deliveryAmount) - Number(user.credit);
      }
    }

    let statusOrder = await this.statusOrderService.findByStep(
      STEP_STATUS_PENDING,
    );

    let dateNow = format(new Date(), 'yyyy-dd-MM HH:mm:ss');
    let bodyOrder = {
      amount: 0,
      amountProducts: 0,
      igv: 0,
      delivery: deliveryAmount,
      amountTotal: 0,
      comissionApp: 0,
      commissionDeliveryMan: 0,
      userId: user._id,
      deliveryManId: null,
      statusOrderId: statusOrder._id,
      typePayId: typePay._id,
      companyId: company._id,
      address: addressRes.address,
      street: addressRes.streetId.name,
      reference: addressRes.reference,
      date: dateNow,
    };

    const newOrder = new this.orderModel(bodyOrder);
    const orderSave = await newOrder.save();
    if (!orderSave) {
      throw new InternalServerErrorException('Error al registrar la orden');
    }

    let bodyOrderDetail: any = {
      orderId: orderSave._id,
    };
    let amountDetail: number = 0;
    let amountTotal: number = 0;
    for (const item of data.details) {
      let product = await this.productService.findOne(item.productId);
      amountDetail =
        Number(Number(product.price) - Number(product.discount || 0)) *
        Number(item.quantity);
      bodyOrderDetail.productId = product._id;
      bodyOrderDetail.quantity = item.quantity;
      bodyOrderDetail.price = product.price;
      bodyOrderDetail.amount = amountDetail.toFixed(2);
      bodyOrderDetail.comment = item.comment;
      amountTotal = amountTotal + amountDetail;
      await this.orderDetailService.create(bodyOrderDetail);
    }
    let amountProducts: number = amountTotal;
    amountTotal = Number(amountTotal) + Number(deliveryAmount);
    let igv = amountTotal * IGV_PORCENTAGE;
    let comissionApp = Number(deliveryAmount) * COMMISSION_APP_PERCENTAGE;
    let commissionDeliveryMan = 0;
    if (Number(deliveryAmount) <= 0) {
      commissionDeliveryMan =
        deliveryAmountBackup * COMMISSION_DEALER_PERCENTAGE;
    } else {
      commissionDeliveryMan =
        Number(deliveryAmount) * COMMISSION_DEALER_PERCENTAGE;
    }

    let bodyUpdate = {
      amount: (Number(amountTotal) - Number(igv)).toFixed(2),
      amountProducts: amountProducts.toFixed(2),
      igv: igv.toFixed(2),
      amountTotal: amountTotal.toFixed(2),
      comissionApp: comissionApp.toFixed(2),
      commissionDeliveryMan: commissionDeliveryMan.toFixed(2),
    };

    let updateCredit = await this.userService.update(
      user._id,
      bodyUpdateCredit,
    );

    let orderResult = await this.orderModel.findByIdAndUpdate(
      orderSave._id,
      bodyUpdate,
      { new: true },
    );

    try {
      let sendPushs = await this.pushNotificationService.sendToDeliveriesMan();
    } catch (error) {
      console.log('ERROR PUSH =>', error);
    }
    this.logger.log('[RESPONSE ORDER] =>', orderResult);
    return orderResult;
  }

  async TakeOrderByDeliveryMan(data: CreateTakeOrderDto) {
    let body: any = {};
    let user = await this.userService.findOne(data.deliveryManId);
    if (String(user.profileId) !== PROFILE_DELIVERY_MAN_ID) {
      throw new BadRequestException(`El usuario no tiene perfil repartidor`);
    }
    body.deliveryManId = user._id;

    let order = await this.orderModel.findOne({ _id: data.orderId });
    if (!order) {
      throw new NotFoundException(`No se encontro el pedido`);
    }

    let step = await this.statusOrderService.findByStep(2);
    body.statusOrderId = step._id;

    let ordersPending = await this.getPendingByDeliveryManId(user._id);
    if (ordersPending.length > 0) {
      throw new BadRequestException(
        `Usted ya cuenta con pedidos por entregar. entregue sus pedidos para poder tomar otras ordenes porfavor`,
      );
    }

    if (String(order.statusOrderId) !== STATUS_ORDER_PENDING_ID) {
      throw new BadRequestException(`EL Pedido no encuentra disponible`);
    }
    if (order.deliveryManId) {
      throw new BadRequestException(
        `El pedido se encuentra confirmado por otro repatidor`,
      );
    }

    let ordetUpdate = await this.orderModel.findByIdAndUpdate(order._id, body, {
      new: true,
    });

    let client = await this.userService.findOne(order.userId.toString());

    if (!ordetUpdate) {
      throw new InternalServerErrorException('Error al actualizar pedido');
    }

    await this.pushNotificationService.sendPushNotificationToDeviceByStatus(
      client,
      user,
      step._id,
    );

    return ordetUpdate;
  }

  async changeStatusByOrderId(data: CreateChangeStatusOrderDto) {
    let bodyUpdate: any = {};
    let order = await this.orderModel.findOne({ _id: data.orderId });
    if (!order) {
      throw new NotFoundException('No existe el pedido');
    }

    let deliveryMan = await this.userService.findOne(order.deliveryManId);
    let status = await this.statusOrderService.findOne(data.statusOrderId);
    bodyUpdate.statusOrderId = status._id;
    let client = await this.userService.findOne(String(order.userId));

    if (String(data.statusOrderId) === STATUS_ORDER_FINALIZED_ID) {
      if (!order.checkDeliveredClient) {
        throw new BadRequestException(
          `Para poder finalizar el pedido necesitas que el cliente confirme que se le fue entregado el pedido correctamente.`,
        );
      }
      bodyUpdate.dateDelivery = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    }

    if (String(order.statusOrderId._id) === STATUS_ORDER_CANCELLED_ID) {
      throw new BadRequestException(`El pedido se encuentra cancelado.`);
    }

    if (
      data.statusOrderId === STATUS_ORDER_CANCELLED_ID &&
      String(order.statusOrderId._id) !== STATUS_ORDER_PENDING_ID
    ) {
      throw new BadRequestException(
        `El pedido ya fue confirmado y se encuentra en proceso de entrega por este motivo no se puede cancelar. Gracias por entender`,
      );
    }

    let ordetUpdate = await this.orderModel.findByIdAndUpdate(
      order._id,
      bodyUpdate,
      { new: true },
    );
    if (!ordetUpdate) {
      throw new InternalServerErrorException('Error al actualizar  pedido');
    }

    if (String(data.statusOrderId) !== STATUS_ORDER_FINALIZED_ID) {
      await this.pushNotificationService.sendPushNotificationToDeviceByStatus(
        client,
        deliveryMan,
        data.statusOrderId,
      );
    }

    return ordetUpdate;
  }

  async confirmDeliveredClient(data: confirmDeliveredClient) {
    let user = await this.userService.findOne(data.userId);

    let order = await this.orderModel.findOne({
      userId: user._id,
      _id: data.orderId,
    });
    if (!order) {
      throw new NotFoundException(`No se encontro el pedido`);
    }

    let ordetUpdate = await this.orderModel.findByIdAndUpdate(
      order._id,
      { checkDeliveredClient: true },
      { new: true },
    );

    await this.pushNotificationService.sendToDeviceByConfirmClient(user);

    if (!ordetUpdate) {
      throw new InternalServerErrorException('Error al actualizar  pedido');
    }
    return ordetUpdate;
  }

  async calification(data: calificationI) {
    let order = await this.orderModel.findOne({ _id: data.orderId });
    if (!order) {
      throw new NotFoundException(`No se encontro el pedido`);
    }
    let ordetUpdate = await this.orderModel.findByIdAndUpdate(
      order._id,
      { calification: data.calification },
      { new: true },
    );
    if (!ordetUpdate) {
      throw new InternalServerErrorException('Error al calificar el pedido');
    }
    return ordetUpdate;
  }

  async getDistanceMatrix(userId: any, companyId: any) {
    let addressCompany = await this.addressCompanyService.findByCompanyId(
      companyId,
    );
    if (!addressCompany) {
      throw new NotFoundException('La empresa no tiene una dirección activa');
    }

    let addressUser = await this.addressService.findOneActiveByUserId(userId);
    if (!addressUser) {
      throw new NotFoundException('El usuario no tiene una dirección activa');
    }
    const origin = `${addressCompany.coordinates.latitude}, ${addressCompany.coordinates.longitude}`;
    const destination = `${addressUser.coordinates.latitude}, ${addressUser.coordinates.longitude}`;

    let result = this.googleMapsService
      .getDistanceMatrix(origin, destination)
      .pipe(
        map((res) => {
          return res.data;
        }),
      )
      .pipe(
        catchError(() => {
          throw new ForbiddenException('API not available');
        }),
      );

    return lastValueFrom(result);
  }

  async calculateAmountDelivery(responseGoogleMaps: any) {
    let distance = 1;

    if (
      responseGoogleMaps &&
      responseGoogleMaps.rows.length > 0 &&
      responseGoogleMaps.rows[0].elements.length > 0 &&
      responseGoogleMaps.rows[0].elements[0] &&
      responseGoogleMaps.rows[0].elements[0].distance &&
      responseGoogleMaps.rows[0].elements[0].distance &&
      responseGoogleMaps.rows[0].elements[0].distance.value
    ) {
      console.log(
        '[RESPONSE_GOOGLE] => ',
        responseGoogleMaps.rows[0].elements[0].distance,
      );
      distance = distance =
        responseGoogleMaps.rows[0].elements[0].distance.value;
    }
    let amount = 5;
    let distanceAmount = await this.distanceAmountService.getByDistance(
      distance,
    );
    if (distanceAmount) {
      amount = Number(distanceAmount.amount);
    }
    return amount;
  }
}
