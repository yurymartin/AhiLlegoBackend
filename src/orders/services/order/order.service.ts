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
import { StatusOrderService } from '../status-order/status-order.service';
import { OrderDetailService } from '../order-detail/order-detail.service';
import {
  COMMISSION_APP_PERCENTAGE,
  COMMISSION_DEALER_PERCENTAGE,
  PROFILE_DELIVERY_MAN_ID,
  STATUS_ORDER_ID_ORDER_PLACED,
  STATUS_ORDER_ID_DRIVER_ASSIGNED,
  STATUS_ORDER_ID_ORDER_READY,
  STATUS_ORDER_ID_IN_PREPARATION,
  STATUS_ORDER_ID_CONFIRMED,
  STATUS_ORDER_ID_CANCELED_BY_CUSTOMER,
  STATUS_ORDER_ID_COMPLETED,
  HEADER_ORDERS_IN_PREPARATION,
  HEADER_ORDERS_IN_DELIVERY,
  HEADER_ORDERS_CANCELED,
  HEADER_ORDERS_IN_FINALIZED,
  STATUS_ORDER_ID_ON_THE_WAY,
  STATUS_ORDER_ID_DELIVERED,
  STATUS_ORDER_ID_ORDER_PICKED_UP,
  STATUS_ORDER_ID_REASSIGNED_TO_ANOTHER_DRIVER,
  STATUS_ORDER_ID_ORDER_REJECTED_BY_STORE,
  STATUS_ORDER_ID_CANCELED_FOR_EXTERNAL_REASONS,
  STATUS_ORDER_ID_CANCELED_BY_DRIVER,
  STATUS_ORDER_ID_CANCELED_BY_STORE,
  TYPE_DISCOUNT_CODE_QUANTITY,
  TYPE_DISCOUNT_CODE_PERCENTAGE,
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
import { AddressCompanyService } from '../../../addresses/services/address-company/address-company.service';
import { catchError, lastValueFrom, map } from 'rxjs';
import { DistanceAmountService } from '../../../addresses/services/distance-amount/distance-amount.service';
import { MapsService } from '../../../google/services/maps/maps.service';
import { PromotionService } from '../promotion/promotion.service';
import { DiscountCodeService } from '../discount-code/discount-code.service';
import { CreateCreditDto } from 'src/orders/dtos/credit.dto';
import { CreditService } from '../credit/credit.service';
import { UpdateUserDto } from 'src/users/dtos/user.dto';

const IGV_PORCENTAGE = 0.18;
const IMPORT_GAIN_PRODUCT = 1;

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
    private readonly companyService: CompanyService,
    private readonly typePayService: TypePayService,
    private readonly userService: UserService,
    private readonly productService: ProductService,
    private readonly statusOrderService: StatusOrderService,
    private readonly orderDetailService: OrderDetailService,
    private readonly googleMapsService: MapsService,
    private readonly addressService: AddressService,
    private readonly addressCompanyService: AddressCompanyService,
    private readonly distanceAmountService: DistanceAmountService,
    private readonly pushNotificationService: PushNotificationService,
    private readonly promotionService: PromotionService,
    private readonly discountCodeService: DiscountCodeService,
    private readonly creditService: CreditService,
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

    let addressCompany = await this.addressCompanyService.findByCompanyId(
      String(order.companyId._id),
    );
    if (!addressCompany) {
      throw new NotFoundException('La empresa no tiene una dirección activa');
    }

    let detail = await this.orderDetailService.findByOrderId(order._id);

    let response = {
      order: order,
      detail: detail,
      addressCompany: addressCompany,
    };
    return response;
  }

  async getAllAvailableForDeliveryMan() {
    let status = await this.statusOrderService.findOne(
      STATUS_ORDER_ID_IN_PREPARATION,
    );
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

  async getAvailableEnterprise(companyId: string) {
    let company = await this.companyService.findOne(companyId);

    let orders = await this.orderModel
      .find({
        $and: [
          { companyId: company._id },
          { statusOrderId: new Types.ObjectId(STATUS_ORDER_ID_ORDER_PLACED) },
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

  async getStatusOrderAndCompanyId(statusOrderId: string, companyId: string) {
    let company = await this.companyService.findOne(companyId);

    let orders = await this.orderModel
      .find({
        $and: [
          { companyId: company._id },
          { statusOrderId: new Types.ObjectId(statusOrderId) },
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

  async getPendingByDeliveryManId(deliveryManId: string) {
    let user = await this.userService.findOne(deliveryManId);

    let orders = await this.orderModel
      .find({
        $and: [
          { deliveryManId: user._id },
          {
            $or: [
              {
                statusOrderId: new Types.ObjectId(
                  STATUS_ORDER_ID_DRIVER_ASSIGNED,
                ),
              },
              {
                statusOrderId: new Types.ObjectId(
                  STATUS_ORDER_ID_ORDER_PICKED_UP,
                ),
              },
              {
                statusOrderId: new Types.ObjectId(STATUS_ORDER_ID_ON_THE_WAY),
              },
              {
                statusOrderId: new Types.ObjectId(STATUS_ORDER_ID_ON_THE_WAY),
              },
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

  async getPendingByCompanyId(companyId: string) {
    const company = await this.companyService.findOne(companyId);

    let orders = await this.orderModel
      .find({
        $and: [
          { companyId: company._id },
          {
            $or: [
              {
                statusOrderId: new Types.ObjectId(STATUS_ORDER_ID_CONFIRMED),
              },
              {
                statusOrderId: new Types.ObjectId(
                  STATUS_ORDER_ID_IN_PREPARATION,
                ),
              },
              {
                statusOrderId: new Types.ObjectId(STATUS_ORDER_ID_ORDER_READY),
              },
              {
                statusOrderId: new Types.ObjectId(
                  STATUS_ORDER_ID_DRIVER_ASSIGNED,
                ),
              },
              {
                statusOrderId: new Types.ObjectId(
                  STATUS_ORDER_ID_ORDER_PICKED_UP,
                ),
              },
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
      statusOrderId: new Types.ObjectId(STATUS_ORDER_ID_COMPLETED),
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
    this.logger.verbose('[user] => ', user);
    let addressRes = await this.addressService.findOne(String(data.addressId));

    const distanceGoogleMaps = await this.getDistanceMatrix(
      user._id,
      company._id,
    );

    let deliveryAmount = await this.calculateAmountDelivery(distanceGoogleMaps);
    this.logger.log('[deliveryAmount] =>', deliveryAmount);

    let comissionApp = deliveryAmount * COMMISSION_APP_PERCENTAGE;
    let commissionDeliveryMan = deliveryAmount * COMMISSION_DEALER_PERCENTAGE;

    let statusOrder = await this.statusOrderService.findOne(
      STATUS_ORDER_ID_ORDER_PLACED,
    );

    //? ***************** MANEJAR LAS PROMOCIONES *****************
    let promotion = await this.promotionService.getCurrentByUserId(user._id);
    let promotionId = null;
    this.logger.verbose('[promotion] => ', promotion);

    let discount = 0;
    if (promotion && JSON.stringify(promotion) !== '{}') {
      deliveryAmount = 0;
      promotionId = promotion._id;
      discount = deliveryAmount;
    }

    //? ***************** FINAL MANEJAR LAS PROMOCIONES *****************

    let dateNow = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    let bodyOrder = {
      amount: 0,
      amountProducts: 0,
      igv: 0,
      delivery: deliveryAmount,
      amountTotal: 0,
      comissionApp: 0,
      commissionDeliveryMan: 0,
      discount: 0,
      amountPayEnteprise: 0,
      userId: user._id,
      deliveryManId: null,
      promotionId: promotionId,
      discountCodeId: null,
      statusOrderId: statusOrder._id,
      typePayId: typePay._id,
      companyId: company._id,
      address: addressRes.address,
      street: addressRes.streetId.name,
      coordinates: addressRes.coordinates,
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
    let profitAhillego: number = 0;

    for (const item of data.details) {
      let product = await this.productService.findOne(item.productId);
      const { price } = product;
      const { quantity, comment } = item;

      const discount: any = product.discount || 0;

      profitAhillego = profitAhillego + Number(quantity) * IMPORT_GAIN_PRODUCT;

      amountDetail = (Number(price) - Number(discount)) * Number(quantity);
      bodyOrderDetail.productId = product._id;
      bodyOrderDetail.quantity = quantity;
      bodyOrderDetail.price = price;
      bodyOrderDetail.amount = amountDetail.toFixed(2);
      bodyOrderDetail.amountEnterprise =
        Number(amountDetail) - Number(quantity) * IMPORT_GAIN_PRODUCT;
      bodyOrderDetail.comment = comment;
      amountTotal = amountTotal + amountDetail;
      await this.orderDetailService.create(bodyOrderDetail);
    }
    this.logger.log('[amountDetail] =>', amountDetail);
    let amountProducts: number = amountTotal;

    amountTotal = amountTotal + deliveryAmount;
    this.logger.log('[amountTotal] =>', amountTotal);

    let bodyUpdateCredit = {
      credit: 0,
    };

    //? ***************** MANEJAR CODIGO DE DESCUENTO *****************
    let discountCodeId = null;
    if (data.discountCodeId) {
      const discountCode = await this.discountCodeService.getActiveById(
        String(data.discountCodeId),
      );
      discountCodeId = discountCode._id;
      console.log('[discountCode] =>', discountCode);
      if (discountCode.type === TYPE_DISCOUNT_CODE_PERCENTAGE) {
        discount = Number(amountProducts) * (Number(discountCode.value) / 100);
        discount = Number(Number(discount).toFixed(2));
        // amountTotal = Number(amountTotal) - Number(discount);
      } else {
        if (Number(discountCode.value) >= Number(amountTotal)) {
          discount = discount + amountTotal;
          amountTotal = 0;
        } else {
          discount = discountCode.value;
          // amountTotal = Number(amountProducts) - Number(discountCode.value);/
        }
      }

      const bodyUpdateCode = {
        quantityAvailable: Number(discountCode.quantityAvailable) - 1 ?? 0,
      };

      const createCredit: CreateCreditDto = {
        code: discountCode.code,
        userId: user._id,
        discountCodeId: discountCode._id,
        status: true,
      };
      const newCredit = this.creditService.create(createCredit);

      const discountCodeUpdate = await this.discountCodeService.update(
        discountCode._id,
        bodyUpdateCode,
      );

      console.log('[discount ONE] =>', discount);
      console.log('[amountProducts ONE] =>', amountProducts);
      console.log('[amountTotal ONE] =>', amountTotal);

      console.log('****************************************');
    }

    //? ***************** FINAL MANEJAR CODIGO DE DESCUENTO *****************

    if (Number(user.credit) > 0) {
      if (Number(user.credit) >= Number(amountTotal)) {
        discount = discount + amountTotal;
        amountTotal = 0;
        bodyUpdateCredit.credit = Number(user.credit) - Number(amountTotal);
      } else {
        discount = discount + Number(user.credit);
        amountTotal = Number(amountTotal) - Number(discount);
        bodyUpdateCredit.credit = 0;
      }
    }

    console.log('[discount TWO] =>', discount);
    console.log('[amountProducts TWO] =>', amountProducts);
    console.log('[amountTotal TWO] =>', amountTotal);

    let igv: number = amountTotal * IGV_PORCENTAGE;

    let bodyUpdate = {
      discountCodeId: discountCodeId,
      amount: (Number(amountTotal) - Number(igv)).toFixed(2),
      amountProducts: amountProducts.toFixed(2),
      igv: igv.toFixed(2),
      amountTotal: amountTotal.toFixed(2),
      comissionApp: comissionApp.toFixed(2),
      commissionDeliveryMan: commissionDeliveryMan.toFixed(2),
      discount: discount,
      amountPayEnteprise: (amountProducts - profitAhillego).toFixed(2),
    };

    this.logger.log('[bodyUpdate] => ', bodyUpdate);

    this.logger.log('[bodyUpdateCredit] =>', bodyUpdateCredit);

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
      // let sendPushs = await this.pushNotificationService.sendToDeliveriesMan();
      let sendPushs = await this.pushNotificationService.sendEnterpriseById(
        company._id,
      );
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

    let statusOrder = await this.statusOrderService.findOne(
      STATUS_ORDER_ID_DRIVER_ASSIGNED,
    );
    body.statusOrderId = statusOrder._id;

    let ordersPending = await this.getPendingByDeliveryManId(user._id);
    if (ordersPending.length > 0) {
      throw new BadRequestException(
        `Usted ya cuenta con pedidos por entregar. entregue sus pedidos para poder tomar otras ordenes porfavor`,
      );
    }

    if (
      String(order.statusOrderId) !== STATUS_ORDER_ID_ORDER_READY &&
      String(order.statusOrderId) !== STATUS_ORDER_ID_IN_PREPARATION
    ) {
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

    if (!ordetUpdate) {
      throw new InternalServerErrorException('Error al actualizar pedido');
    }

    try {
      await this.pushNotificationService.sendPushNotificationToDeviceByStatus(
        order.userId,
        String(statusOrder._id),
      );
    } catch (ex) {
      console.log('[ERROR AL ENVIAR PUSH ] => ', ex);
    }

    return ordetUpdate;
  }

  async changeStatusByOrderId(data: CreateChangeStatusOrderDto) {
    let bodyUpdate: any = {};
    let order = await this.orderModel.findOne({ _id: data.orderId });
    if (!order) {
      throw new NotFoundException('No existe el pedido');
    }

    let statusCurrent = await this.statusOrderService.findOne(
      order.statusOrderId,
    );

    if (Number(statusCurrent.header) === HEADER_ORDERS_CANCELED) {
      throw new BadRequestException(
        `Lamentamos informarte que el pedido fue cancelado y ya no esta disponible.`,
      );
    }

    if (Number(statusCurrent.header) === HEADER_ORDERS_IN_FINALIZED) {
      throw new BadRequestException(`El pedido se ya fue finalizado.`);
    }

    if (String(data.statusOrderId) === STATUS_ORDER_ID_COMPLETED) {
      if (!order.checkDeliveredClient) {
        throw new BadRequestException(
          `Para poder finalizar el pedido necesitas que el cliente confirme que se le fue entregado el pedido correctamente.`,
        );
      }
      bodyUpdate.dateDelivery = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    }

    if (data.statusOrderId === STATUS_ORDER_ID_CANCELED_BY_CUSTOMER) {
      if (
        statusCurrent.header == HEADER_ORDERS_IN_PREPARATION ||
        statusCurrent.header == HEADER_ORDERS_IN_DELIVERY
      ) {
        throw new BadRequestException(
          `El pedido ya fue confirmado y se encuentra en proceso de entrega por este motivo no se puede cancelar. Gracias por entender`,
        );
      }
    }

    if (data.statusOrderId === STATUS_ORDER_ID_CONFIRMED) {
      data.statusOrderId = STATUS_ORDER_ID_IN_PREPARATION;
      bodyUpdate.dateTimeConfirmed = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    }

    bodyUpdate.statusOrderId = new Types.ObjectId(data.statusOrderId);

    let ordetUpdate = await this.orderModel.findByIdAndUpdate(
      order._id,
      bodyUpdate,
      { new: true },
    );
    if (!ordetUpdate) {
      throw new InternalServerErrorException('Error al actualizar  pedido');
    }

    try {
      if (
        String(data.statusOrderId) === STATUS_ORDER_ID_ORDER_READY ||
        String(data.statusOrderId) === STATUS_ORDER_ID_IN_PREPARATION
      ) {
        await this.pushNotificationService.sendToDeliveriesMan();
      }
    } catch (ex) {
      console.log('[ERROR AL ENVIAR PUSH AL CLIENTE] => ', ex);
    }

    try {
      if (
        String(data.statusOrderId) === STATUS_ORDER_ID_CONFIRMED ||
        String(data.statusOrderId) === STATUS_ORDER_ID_IN_PREPARATION ||
        String(data.statusOrderId) === STATUS_ORDER_ID_DRIVER_ASSIGNED ||
        String(data.statusOrderId) === STATUS_ORDER_ID_ON_THE_WAY ||
        String(data.statusOrderId) === STATUS_ORDER_ID_CANCELED_BY_STORE ||
        String(data.statusOrderId) === STATUS_ORDER_ID_CANCELED_BY_DRIVER ||
        String(data.statusOrderId) ===
          STATUS_ORDER_ID_CANCELED_FOR_EXTERNAL_REASONS ||
        String(data.statusOrderId) ===
          STATUS_ORDER_ID_ORDER_REJECTED_BY_STORE ||
        String(data.statusOrderId) ===
          STATUS_ORDER_ID_REASSIGNED_TO_ANOTHER_DRIVER
      ) {
        await this.pushNotificationService.sendPushNotificationToDeviceByStatus(
          order.userId,
          data.statusOrderId,
        );
      }
    } catch (ex) {
      console.log('[ERROR AL ENVIAR PUSH AL CLIENTE] => ', ex);
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

    if (order.discountCodeId) {
      const discountCode = await this.discountCodeService.getById(
        order.discountCodeId,
      );
      const representativePercentage =
        (Number(order.amountProducts) *
          Number(discountCode.representativePercentage)) /
        100;
      const updateUserCredit: UpdateUserDto = {
        credit: Number(representativePercentage.toFixed(2)),
      };
      const userUpdate = await this.userService.update(
        discountCode.userId.toString(),
        updateUserCredit,
      );
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
