import { Injectable } from '@nestjs/common';
import { UserSessionService } from '../../../users/services/user-session/user-session.service';
import { ConnectionService } from '../connection/connection.service';
import * as admin from 'firebase-admin';
import { PROFILE_DELIVERY_MAN_ID } from '../../../common/constants';
import { MulticastMessage } from 'firebase-admin/lib/messaging/messaging-api';
import { handlerByStatusId } from '../../../common/helper/notificationOrder';
import { CompanyService } from '../../../companies/services/company/company.service';

const ICON_PUSH = 'assets_images_logo_circle';

@Injectable()
export class PushNotificationService {
  constructor(
    private readonly userSessionService: UserSessionService,
    private readonly companyService: CompanyService,
    private connectionService: ConnectionService,
  ) {}

  async sendPushNotificationToDeviceByStatus(
    userId: any,
    statusOrderId: string,
  ) {
    try {
      let userSession = await this.userSessionService.findOnebyUser(userId);
      if (userSession && userSession.tokenDevice) {
        let registrationToken = userSession.tokenDevice;
        let app = this.connectionService.initializeFirebase();
        let notification = handlerByStatusId(statusOrderId);
        const payload = {
          notification: {
            title: notification.title,
            body: notification.message,
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
          console.log('[ENVIO DE PUSH EXITOSO AL CLIENTE] => ', response);
        } else {
          console.log('[ERROR AL ENVIAR PUSH AL CLIENTE]');
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

  async sendToDeviceByConfirmClient(userCliente: any) {
    try {
      let userSession = await this.userSessionService.findOnebyUser(
        userCliente._id,
      );
      if (userSession && userSession.tokenDevice) {
        let registrationToken = userSession.tokenDevice;
        let app = this.connectionService.initializeFirebase();
        const body = {
          title: 'Tu pedido ha sido entregado',
          message:
            '¡Felicidades! Tu pedido ha sido entregado satisfactoriamente. Esperamos que disfrutes de tu pedido. ¡Gracias por elegir nuestro servicio de delivery ahi-llego!',
        };
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
          console.log(
            '[ENVIO DE PUSH DE CONFIRMACION ENTREGA EXITOSO] => ',
            response,
          );
        } else {
          console.log('[ERROR AL ENVIAR PUSH DE CONFIRMACION ENTREGA]');
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
            body: '¡Atención, repartidor! Un nuevo pedido listo para recoger acaba de llegar a la aplicación de delivery Ahí-Llego Repartidor. Ingresa a la app de para aceptar el pedido y conocer la dirección y los detalles del pedido.',
          },
          android: {
            priority: 'high',
            notification: {
              title: '¡Nuevo pedido disponible!',
              body: '¡Atención, repartidor! Un nuevo pedido listo para recoger acaba de llegar a la aplicación de delivery Ahí-Llego Repartidor. Ingresa a la app de para aceptar el pedido y conocer la dirección y los detalles del pedido.',
              sound: 'default',
              color: '#01ffff',
              icon: ICON_PUSH,
            },
          },
          tokens: tokens,
        };

        let response = await admin.messaging().sendMulticast(messages);
        if (response) {
          console.log(
            '[ENVIO DE PUSH EXITOSO A LOS REPARTIDORES] => ',
            response,
          );
        } else {
          console.log('[ERROR AL ENVIAR PUSH A LOS REPARTIDORES]');
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

  async sendEnterpriseById(companyId: string) {
    try {
      const company = await this.companyService.findOne(companyId);

      const userSession = await this.userSessionService.findOnebyUser(
        company.userId,
      );

      if (userSession) {
        let tokens = [userSession.tokenDevice];
        if (tokens && tokens.length > 0) {
          let app = this.connectionService.initializeFirebase();
          const messages: MulticastMessage = {
            notification: {
              title: '¡Nuevo pedido disponible!',
              body: `¡Atención, ${company.name}! Un nuevo pedido acaba de llegar a la aplicación de delivery Ahí-Llego Empresa. Ingresa a la app de para aceptar el confirmar y conocer los detalles del pedido.`,
            },
            android: {
              priority: 'high',
              notification: {
                title: '¡Nuevo pedido disponible!',
                body: `¡Atención, ${company.name}! Un nuevo pedido acaba de llegar a la aplicación de delivery Ahí-Llego Empresa. Ingresa a la app de para aceptar el confirmar y conocer los detalles del pedido.`,
                sound: 'default',
                color: '#01ffff',
                icon: ICON_PUSH,
              },
            },
            tokens: tokens,
          };

          let response = await admin.messaging().sendMulticast(messages);
          if (response) {
            console.log('[ENVIO DE PUSH EXITOS0 A LA EMPRESA] => ', response);
          } else {
            console.log('[ERROR AL ENVIAR PUSH A LA EMPRESA]');
          }
          await app.delete();
          return response;
        } else {
          return null;
        }
      }
    } catch (error) {
      console.log('[ERROR sendToDeliveriesMan] => ', error);
    }
  }

  async sendToArrayTokens(tokens: Array<any>, title: string, message: string) {
    try {
      if (tokens && tokens.length > 0) {
        let app = this.connectionService.initializeFirebase();
        const messages: MulticastMessage = {
          notification: {
            title: title,
            body: message,
          },
          android: {
            priority: 'high',
            notification: {
              title: title,
              body: message,
              sound: 'default',
              color: '#01ffff',
              icon: ICON_PUSH,
            },
          },
          tokens: tokens,
        };

        let response = await admin.messaging().sendMulticast(messages);
        if (response) {
          console.log('[ENVIO MASIVO DE PUSH POR PERFIL] => ', response);
        } else {
          console.log('[ERROR MASIVO DE PUSH POR PERFIL]');
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
}
