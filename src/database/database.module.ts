import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import config from '../config/configuration';

//mongodb+srv://root:<password>@ahillego.emjvipc.mongodb.net/?retryWrites=true&w=majority

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigType<typeof config>) => {
        const { connection, user, password, host, port, dbName, keyUrl } =
          configService.mongo;
        return {
          //   uri: `${connection}://${host}:${port}`,
          uri: `${connection}://${user}:${password}@${dbName}.${keyUrl}.mongodb.net/?retryWrites=true&w=majority`,
          user,
          pass: password,
          dbName,
        };
      },
      inject: [config.KEY],
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
