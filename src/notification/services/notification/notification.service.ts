import { Injectable } from '@nestjs/common';
import { UserSessionService } from '../../../users/services/user-session/user-session.service';
import { UserService } from '../../../users/services/user/user.service';
import { SendNotificationByProfileIdDto } from '../../dtos/sendNotificationByProfileId.dto';
import { PushNotificationService } from '../../../firebase/services/push-notification/push-notification.service';
import { User } from '../../../users/schemas/user.schema';
import { UserSession } from '../../../users/schemas/userSession.schema';
import { Types } from 'mongoose';

@Injectable()
export class NotificationService {
  constructor(
    private readonly userService: UserService,
    private readonly userSessionService: UserSessionService,
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  async sendNotificationByProfileId(data: SendNotificationByProfileIdDto) {
    const users = await this.userService.findByProfileId(data.profileId);
    let arrayIds = [];
    let tokens = [];
    if (users && users.length > 0) {
      users.forEach((element: User) => {
        arrayIds.push(new Types.ObjectId(element._id));
      });
      const listSesions = await this.userSessionService.findByArrayUserIds(
        arrayIds,
      );

      if (listSesions && listSesions.length > 0) {
        listSesions.forEach((element: UserSession) => {
          tokens.push(element.tokenDevice);
        });
      }
      const result = await this.pushNotificationService.sendToArrayTokens(
        tokens,
        data.title,
        data.message,
      );
      return result;
    }
    return {
      success: 0,
    };
  }
}
