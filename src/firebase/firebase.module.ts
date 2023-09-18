import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { PushNotificationService } from './services/push-notification/push-notification.service';
import { ConnectionService } from './services/connection/connection.service';
import { ConfigModule } from '@nestjs/config';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [UsersModule, CompaniesModule, ConfigModule],
  providers: [PushNotificationService, ConnectionService],
  exports: [PushNotificationService],
})
export class FirebaseModule {}
