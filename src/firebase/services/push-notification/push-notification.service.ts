import { Injectable } from '@nestjs/common';
import { UserSessionService } from '../../../users/services/user-session/user-session.service';
import { ConnectionService } from '../connection/connection.service';
import * as admin from 'firebase-admin';
import {
  STATUS_ORDER_FINALIZED_ID,
  STATUS_ORDER_ON_ROUTE_ID,
  STATUS_ORDER_PENDING_ID,
  STATUS_ORDER_PROCESSING_ID,
  STATUS_ORDER_CANCELLED_ID,
  PROFILE_DELIVERY_MAN_ID,
} from '../../../common/constants';
import { MulticastMessage } from 'firebase-admin/lib/messaging/messaging-api';

const ICON_PUSH = 'assets_images_logo_circle';

@Injectable()
export class PushNotificationService {
  constructor(
    private readonly userSessionService: UserSessionService,
    private connectionService: ConnectionService,
  ) {}

  async sendPushNotificationToDeviceByStatus(
    userCliente: any,
    deliveryMan: any,
    statusOrderId: string,
  ) {
    try {
      let userSession = await this.userSessionService.findOnebyUser(
        userCliente._id,
      );
      if (userSession && userSession.tokenDevice) {
        let registrationToken = userSession.tokenDevice;
        let app = this.connectionService.initializeFirebase();
        let body = this.handlerMessageByStatus(statusOrderId, deliveryMan);
        const payload = {
          notification: {
            title: body.title,
            body: body.message,
            sound: 'default',
            color: '#01ffff',
            icon: ICON_PUSH,
          },
        };
        const options = {
          priority: 'high',
          timeToLive: 60 * 60 * 24,
        };
        let response = await admin
          .messaging()
          .sendToDevice(registrationToken, payload, options);
        if (response) {
          console.log('Successfully sent message:', response);
        } else {
          console.log('Error sending message:');
        }
        await app.delete();
        return response;
      } else {
        return false;
      }
    } catch (ex) {
      console.log('Error sending message:', ex);
    }
  }

  async sendToDeliveriesMan() {
    try {
      let usersSession = await this.userSessionService.findByProfile(
        PROFILE_DELIVERY_MAN_ID,
      );
      let tokens = [];
      if (usersSession && usersSession.length > 0) {
        for (const userSession of usersSession) {
          if (userSession && userSession.tokenDevice) {
            tokens.push(userSession.tokenDevice);
          }
        }
      }
      if (tokens && tokens.length > 0) {
        let app = this.connectionService.initializeFirebase();
        const messages: MulticastMessage = {
          notification: {
            title: '¡Nuevo pedido disponible!',
            body: '¡Atención, repartidor! Un nuevo pedido acaba de llegar a la aplicación de delivery Ahí-Llego Repartidor. Ingresa a la app de para aceptar el pedido y conocer la dirección y los detalles del pedido.',
          },
          android: {
            priority: 'high',
            notification: {
              title: '¡Nuevo pedido disponible!',
              body: '¡Atención, repartidor! Un nuevo pedido acaba de llegar a la aplicación de delivery Ahí-Llego Repartidor. Ingresa a la app de para aceptar el pedido y conocer la dirección y los detalles del pedido.',
              sound: 'default',
              color: '#01ffff',
              icon: ICON_PUSH,
            },
          },
          tokens: tokens,
        };

        let response = await admin.messaging().sendMulticast(messages);
        if (response) {
          console.log('Successfully sent message:', response);
        } else {
          console.log('Error sending message:');
        }
        await app.delete();
        return response;
      } else {
        return null;
      }
    } catch (error) {
      console.log('[ERROR sendToDeliveriesMan] => ', error);
    }
  }

  handlerMessageByStatus(statusOrderId: string, deliveryMan: any) {
    let result = {
      title: '',
      message: '',
    };
    switch (statusOrderId) {
      case STATUS_ORDER_PENDING_ID:
        result.title = 'Pedido Pendiente';
        result.message = '';
        break;
      case STATUS_ORDER_PROCESSING_ID:
        result.title = 'Confirmación de tu pedido';
        result.message = `Hola, queremos informarte que tu pedido ha sido confirmado y será entregado pronto. Nuestro repartidor ${deliveryMan.name} se encuentra en camino para recoger tu pedido. Por favor, mantente pendiente de tu teléfono. ¡Gracias por elegir nuestro servicio de delivery!`;
        break;
      case STATUS_ORDER_ON_ROUTE_ID:
        result.title = 'Tu pedido está en camino';
        result.message =
          '¡Hola! Queremos informarte que tu pedido ahora se encuentra en camino. Por favor, mantente pendiente de tu teléfono. ¡Gracias por elegir nuestro servicio de delivery!';
        break;
      case STATUS_ORDER_FINALIZED_ID:
        result.title = 'Tu pedido ha sido entregado';
        result.message =
          '¡Felicidades! Tu pedido ha sido entregado satisfactoriamente. Esperamos que disfrutes de tu pedido y Si gustas porfavor podrias calificar la atención del repartidor en la parte de historial ¡Gracias por elegir nuestro servicio de delivery!';
        break;
      case STATUS_ORDER_CANCELLED_ID:
        result.title = 'Pedido cancelado';
        result.message =
          'Lamentablemente, tu pedido ha sido cancelado. Te pedimos disculpas por cualquier inconveniente que esto pueda haber causado. Si tienes alguna pregunta o necesitas ayuda adicional, no dudes en contactarnos. ¡Gracias por elegir nuestro servicio de delivery';
        break;

      default:
        result.title = 'Confirmación de tu pedido';
        result.message = `Hola, queremos informarte que tu pedido ha sido confirmado y será entregado pronto. Nuestro repartidor ${deliveryMan.name} se encuentra en camino para recoger tu pedido. Por favor, mantente pendiente de tu teléfono. ¡Gracias por elegir nuestro servicio de delivery!`;
        break;
    }
    return result;
  }
}
