import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  mongo: {
    dbName: process.env.MONGO_DB,
    keyUrl: process.env.MONGO_KEY_URL,
    user: process.env.MONGO_INITDB_ROOT_USERNAME,
    password: process.env.MONGO_INITDB_ROOT_PASSWORD,
    port: parseInt(process.env.MONGO_PORT, 10),
    host: process.env.MONGO_HOST,
    connection: process.env.MONGO_CONNECTION,
  },
  jwt: {
    keySecret: process.env.KEY_SECRET_JWT,
    timeExpiry: process.env.JWT_TIME_EXPIRATION,
  },
  firebase: {
    firebaseCredentials: process.env.FIREBASE_CREDENTIALS,
  },
}));
