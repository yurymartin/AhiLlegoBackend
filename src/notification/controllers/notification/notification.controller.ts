import { Body, Controller, Get, Post } from '@nestjs/common';
import { NotificationService } from '../../services/notification/notification.service';
import { SendNotificationByProfileIdDto } from '../../dtos/sendNotificationByProfileId.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send-notification-profile')
  async sendNotificationByProfileId(
    @Body() payload: SendNotificationByProfileIdDto,
  ) {
    return await this.notificationService.sendNotificationByProfileId(payload);
  }
}
