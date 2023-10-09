export const PROFILE_ADMIN_ID = '6455a6e7d70d6ad4c3368119';
export const PROFILE_ENTERPRISE_ID = '6455a6fbd70d6ad4c336811c';
export const PROFILE_DELIVERY_MAN_ID = '6455a6ffd70d6ad4c336811e';
export const PROFILE_CUSTOMER_ID = '6455a703d70d6ad4c3368120';

//* Inicio -- Estados de un pedido
export const STATUS_ORDER_ID_ORDER_PLACED = '64f1fb1e51164d1d3b761874'; // Pedido Realizado
export const STATUS_ORDER_ID_SENDING_TO_STORE = '64f1fb3d51164d1d3b761877'; // Enviando a la Tienda
export const STATUS_ORDER_ID_WAITING_FOR_CONFIRMATION =
  '64f1fb6d51164d1d3b76187a'; // Esperando Confirmación
export const STATUS_ORDER_ID_CONFIRMED = '64f1fb8d51164d1d3b76187d'; // Confirmado
export const STATUS_ORDER_ID_IN_PREPARATION = '64f1fc7151164d1d3b761881'; // En Preparando
export const STATUS_ORDER_ID_ORDER_READY = '64f2129ebeb7615944f88c36'; // Pedido Listo
export const STATUS_ORDER_ID_DRIVER_ASSIGNED = '64f212c6beb7615944f88c39'; // Repartidor Asignado
export const STATUS_ORDER_ID_ORDER_PICKED_UP = '64f212e4beb7615944f88c3b'; // Pedido recogido
export const STATUS_ORDER_ID_ON_THE_WAY = '64f2131dbeb7615944f88c3d'; // En Camino
export const STATUS_ORDER_ID_DELIVERED = '64f21346beb7615944f88c3f'; // Entregado
export const STATUS_ORDER_ID_COMPLETED = '64f2135bbeb7615944f88c41'; // Completado
export const STATUS_ORDER_ID_CANCELED_BY_CUSTOMER = '64f21375beb7615944f88c43'; // Cancelado por el Cliente
export const STATUS_ORDER_ID_CANCELED_BY_STORE = '64f21384beb7615944f88c45'; // Cancelado por la Tienda
export const STATUS_ORDER_ID_CANCELED_BY_DRIVER = '64f21396beb7615944f88c47'; // Cancelado por el Repartidor
export const STATUS_ORDER_ID_CANCELED_FOR_EXTERNAL_REASONS =
  '64f213a9beb7615944f88c49'; // Cancelado por Razones Externas
export const STATUS_ORDER_ID_ORDER_REJECTED_BY_STORE =
  '64f213bbbeb7615944f88c4b'; // Pedido Rechazado por la Tienda
export const STATUS_ORDER_ID_REASSIGNED_TO_ANOTHER_DRIVER =
  '64f213d6beb7615944f88c4d'; // Reasignado a Otro Repartidor
//* Fin -- Estados de un pedido

//* Inicio -- ESTADOS GLOABLES DE UN PEDIDO
export const HEADER_ORDERS_IN_CONFIRMATION = 1; // Pedido en confirmación
export const HEADER_ORDERS_IN_PREPARATION = 2; // Pedido en prepación
export const HEADER_ORDERS_IN_DELIVERY = 3; // Pedido en entrega
export const HEADER_ORDERS_IN_FINALIZED = 4; // Pedido finalizados
export const HEADER_ORDERS_CANCELED = 5; // Pedido cancelado
//* Fin -- ESTADOS GLOABLES DE UN PEDIDO

export const PROMOTION_TYPE_FIRST_DELIVERY_FREE = 1;
export const PROMOTION_TYPE_DELIVERY_FREE = 2;

export const CODE_SETTING_AMOUNT_DELIVERY_DEFAULT = 'MDD';

export const COMMISSION_APP_PERCENTAGE = 0;
export const COMMISSION_DEALER_PERCENTAGE = 1;

export const STEP_STATUS_PENDING = 1;

export const SALT_OR_ROUNDS = 10;

export const TYPE_DISCOUNT_CODE_QUANTITY = 'QUANTITY';
export const TYPE_DISCOUNT_CODE_PERCENTAGE = 'PERCENTAGE';
