import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { PushNotificationService } from './services/push-notification/push-notification.service';
import { ConnectionService } from './services/connection/connection.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UsersModule, ConfigModule],
  providers: [PushNotificationService, ConnectionService],
  exports: [PushNotificationService],
})
export class FirebaseModule {}
