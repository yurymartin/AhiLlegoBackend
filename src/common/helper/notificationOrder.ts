import {
  STATUS_ORDER_ID_CANCELED_BY_CUSTOMER,
  STATUS_ORDER_ID_CANCELED_BY_DRIVER,
  STATUS_ORDER_ID_CANCELED_BY_STORE,
  STATUS_ORDER_ID_CANCELED_FOR_EXTERNAL_REASONS,
  STATUS_ORDER_ID_COMPLETED,
  STATUS_ORDER_ID_CONFIRMED,
  STATUS_ORDER_ID_DELIVERED,
  STATUS_ORDER_ID_DRIVER_ASSIGNED,
  STATUS_ORDER_ID_IN_PREPARATION,
  STATUS_ORDER_ID_ON_THE_WAY,
  STATUS_ORDER_ID_ORDER_PICKED_UP,
  STATUS_ORDER_ID_ORDER_PLACED,
  STATUS_ORDER_ID_ORDER_READY,
  STATUS_ORDER_ID_ORDER_REJECTED_BY_STORE,
  STATUS_ORDER_ID_REASSIGNED_TO_ANOTHER_DRIVER,
  STATUS_ORDER_ID_SENDING_TO_STORE,
  STATUS_ORDER_ID_WAITING_FOR_CONFIRMATION,
} from '../constants';

const notifications = {
  STATUS_ORDER_ID_ORDER_PLACED: {
    title: 'Pedido Realizado',
    message:
      'Tu pedido en Ahí-Llego ha sido registrado correctamente. Estamos trabajando en él.',
  },
  STATUS_ORDER_ID_SENDING_TO_STORE: {
    title: 'Enviando a la Tienda',
    message:
      'Tu pedido en Ahí-Llego está en camino hacia la tienda seleccionada.',
  },
  STATUS_ORDER_ID_WAITING_FOR_CONFIRMATION: {
    title: 'Esperando Confirmación',
    message:
      'Estamos esperando la confirmación de la tienda en Ahí-Llego para procesar tu pedido.',
  },
  STATUS_ORDER_ID_CONFIRMED: {
    title: 'Pedido Confirmado',
    message:
      '¡Hola Estamos emocionados de informarte que la tienda ha confirmado tu pedido en Ahí-Llego. Tu comida está en proceso de preparación y estará en camino pronto.',
  },
  STATUS_ORDER_ID_IN_PREPARATION: {
    title: 'Pedido en Preparación',
    message:
      '¡Hola Estamos emocionados de informarte que la tienda ha confirmado tu pedido en Ahí-Llego. Tu comida está en proceso de preparación y estará en camino pronto.',
  },
  STATUS_ORDER_ID_ORDER_READY: {
    title: 'Pedido Listo',
    message:
      'Tu pedido en Ahí-Llego está listo para ser recogido por el repartidor asignado.',
  },
  STATUS_ORDER_ID_DRIVER_ASSIGNED: {
    title: 'Repartidor Asignado',
    message:
      'Queremos informarte que un repartidor de Ahí-Llego ha tomado tu pedido y se encuentra en camino para recoger tu pedido. Por favor, mantente pendiente de tu teléfono',
  },
  STATUS_ORDER_ID_ORDER_PICKED_UP: {
    title: 'Pedido Recogido',
    message:
      'El repartidor en Ahí-Llego ha recogido tu pedido y está en camino.',
  },
  STATUS_ORDER_ID_ON_THE_WAY: {
    title: 'En Camino',
    message:
      '¡Hola queremos informarte que tu pedido está en camino hacia tu ubicación. mantente pendiente de tu teléfono',
  },
  STATUS_ORDER_ID_DELIVERED: {
    title: 'Entregado',
    message: '¡Tu pedido en Ahí-Llego ha sido entregado con éxito!',
  },
  STATUS_ORDER_ID_COMPLETED: {
    title: 'Completado',
    message: 'Tu pedido en Ahí-Llego se ha completado satisfactoriamente.',
  },
  STATUS_ORDER_ID_CANCELED_BY_CUSTOMER: {
    title: 'Cancelado por el Cliente',
    message:
      '¡Hola Hemos recibido tu solicitud de cancelación para tu pedido en Ahí-Llego. Tu pedido ha sido cancelado con éxito. Si tienes alguna pregunta o necesitas asistencia adicional, no dudes en contactarnos.',
  },
  STATUS_ORDER_ID_CANCELED_BY_STORE: {
    title: 'Cancelado por la Tienda',
    message: 'La tienda en Ahí-Llego ha cancelado tu pedido.',
  },
  STATUS_ORDER_ID_CANCELED_BY_DRIVER: {
    title: 'Cancelado por el Repartidor',
    message: 'El repartidor en Ahí-Llego ha cancelado la entrega de tu pedido.',
  },
  STATUS_ORDER_ID_CANCELED_FOR_EXTERNAL_REASONS: {
    title: 'Cancelado por Razones Externas',
    message:
      'Lamentablemente, tu pedido en Ahí-Llego ha sido cancelado debido a razones fuera de nuestro control.',
  },
  STATUS_ORDER_ID_ORDER_REJECTED_BY_STORE: {
    title: 'Pedido Rechazado',
    message:
      '¡Lamentamos informarte que la tienda ha rechazado tu pedido en Ahí-Llego debido a la falta de disponibilidad de los productos solicitados. Te pedimos disculpas!.',
  },
  STATUS_ORDER_ID_REASSIGNED_TO_ANOTHER_DRIVER: {
    title: 'Reasignado a Otro Repartidor',
    message:
      'Tu pedido en Ahí-Llego ha sido reasignado a otro repartidor para su entrega.',
  },
};

const defaultMessage = {
  title: 'Ahí-Llego!',
  message:
    'El estado de su pedido ha cambiado. Por favor, consulte los detalles en la aplicación.',
};

export const handlerByStatusId = (statusId: string) => {
  let notification: any = defaultMessage;
  switch (statusId) {
    case STATUS_ORDER_ID_ORDER_PLACED:
      notification = notifications.STATUS_ORDER_ID_ORDER_PLACED;
      break;
    case STATUS_ORDER_ID_SENDING_TO_STORE:
      notification = notifications.STATUS_ORDER_ID_SENDING_TO_STORE;
      break;
    case STATUS_ORDER_ID_WAITING_FOR_CONFIRMATION:
      notification = notifications.STATUS_ORDER_ID_WAITING_FOR_CONFIRMATION;
      break;
    case STATUS_ORDER_ID_CONFIRMED:
      notification = notifications.STATUS_ORDER_ID_CONFIRMED;
      break;
    case STATUS_ORDER_ID_IN_PREPARATION:
      notification = notifications.STATUS_ORDER_ID_IN_PREPARATION;
      break;
    case STATUS_ORDER_ID_ORDER_READY:
      notification = notifications.STATUS_ORDER_ID_ORDER_READY;
      break;
    case STATUS_ORDER_ID_DRIVER_ASSIGNED:
      notification = notifications.STATUS_ORDER_ID_DRIVER_ASSIGNED;
      break;
    case STATUS_ORDER_ID_ORDER_PICKED_UP:
      notification = notifications.STATUS_ORDER_ID_ORDER_PICKED_UP;
      break;
    case STATUS_ORDER_ID_ON_THE_WAY:
      notification = notifications.STATUS_ORDER_ID_ON_THE_WAY;
      break;
    case STATUS_ORDER_ID_DELIVERED:
      notification = notifications.STATUS_ORDER_ID_DELIVERED;
      break;
    case STATUS_ORDER_ID_COMPLETED:
      notification = notifications.STATUS_ORDER_ID_COMPLETED;
      break;
    case STATUS_ORDER_ID_CANCELED_BY_CUSTOMER:
      notification = notifications.STATUS_ORDER_ID_CANCELED_BY_CUSTOMER;
      break;
    case STATUS_ORDER_ID_CANCELED_BY_STORE:
      notification = notifications.STATUS_ORDER_ID_CANCELED_BY_STORE;
      break;
    case STATUS_ORDER_ID_CANCELED_BY_DRIVER:
      notification = notifications.STATUS_ORDER_ID_CANCELED_BY_DRIVER;
      break;
    case STATUS_ORDER_ID_CANCELED_FOR_EXTERNAL_REASONS:
      notification =
        notifications.STATUS_ORDER_ID_CANCELED_FOR_EXTERNAL_REASONS;
      break;
    case STATUS_ORDER_ID_ORDER_REJECTED_BY_STORE:
      notification = notifications.STATUS_ORDER_ID_ORDER_REJECTED_BY_STORE;
      break;
    case STATUS_ORDER_ID_REASSIGNED_TO_ANOTHER_DRIVER:
      notification = notifications.STATUS_ORDER_ID_REASSIGNED_TO_ANOTHER_DRIVER;
      break;
    default:
      notification = defaultMessage;
      break;
  }
  console.log('[MENSAJE A ENVIAR] =>', notification);
  return notification;
};
