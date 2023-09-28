import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { NotificationService } from './services/notification/notification.service';
import { NotificationController } from './controllers/notification/notification.controller';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [UsersModule, FirebaseModule],
  providers: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
