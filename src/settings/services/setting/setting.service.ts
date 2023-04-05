import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSettingDto } from '../../dtos/setting.dto';
import { Setting } from '../../schemas/setting.schema';

@Injectable()
export class SettingService {
  constructor(
    @InjectModel(Setting.name)
    private readonly settingModel: Model<Setting>,
  ) {}

  async findAll() {
    const setting = await this.settingModel.find({}).exec();
    return setting;
  }

  async findByCode(code: string) {
    const setting = await this.settingModel.findOne({ code: code }).exec();
    if (!setting) {
      throw new NotFoundException(`No se encontro la configuracion por codigo`);
    }
    return setting;
  }

  async create(data: CreateSettingDto) {
    const newSetting = new this.settingModel(data);
    const settingSave = await newSetting.save();
    if (!settingSave) {
      throw new InternalServerErrorException(
        'Error al registrar la configuración',
      );
    }
    return settingSave;
  }
}
