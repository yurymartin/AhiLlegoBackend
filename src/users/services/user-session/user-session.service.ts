import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { UserSession } from '../../schemas/userSession.schema';
import { User } from './../../../users/schemas/user.schema';
import {
  CreateUserSesionDto,
  UpdateUserSesionDto,
} from '../../dtos/userSesion.dto';

@Injectable()
export class UserSessionService {
  constructor(
    @InjectModel(UserSession.name)
    private readonly userSessionModel: Model<UserSession>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findOne(id: string): Promise<UserSession> {
    const userSession = await this.userSessionModel.findOne({ _id: id }).exec();
    return userSession;
  }

  async findByArrayUserIds(arrayIds: Array<any>): Promise<UserSession[]> {
    const userSession = await this.userSessionModel
      .find({ userId: { $in: arrayIds } })
      .exec();
    return userSession;
  }

  async findOnebyUser(userId: string | any): Promise<UserSession> {
    const userSession = await this.userSessionModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .exec();

    return userSession;
  }

  async findByProfile(profileId: string): Promise<UserSession[]> {
    const userSessions = await this.userSessionModel
      .find({ profileId: new Types.ObjectId(profileId) })
      .exec();
    return userSessions;
  }

  async create(data: CreateUserSesionDto): Promise<UserSession> {
    const newSession = new this.userSessionModel(data);
    let sessionSave = await newSession.save();
    if (!sessionSave) {
      throw new InternalServerErrorException('Error al registrar la session');
    }
    return sessionSave;
  }

  async update(id: string, data: UpdateUserSesionDto): Promise<UserSession> {
    let sessionUpdate = await this.userSessionModel.findByIdAndUpdate(
      id,
      data,
      { new: true },
    );
    let newSession = await sessionUpdate.save();
    if (!newSession) {
      throw new InternalServerErrorException('Error al actualizar la session');
    }
    return newSession;
  }
}
