import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MongoIdPipe } from '../../../common/pipe/mongo-id/mongo-id.pipe';
import { CreateSettingDto } from '../../dtos/setting.dto';
import { SettingService } from '../../services/setting/setting.service';

@Controller('setting')
export class SettingController {
  constructor(private settingService: SettingService) {}

  @Get()
  async findAll() {
    return await this.settingService.findAll();
  }

  @Post()
  async create(@Body() payload: CreateSettingDto) {
    return await this.settingService.create(payload);
  }

  @Get(':code')
  async findByCode(@Param('code', MongoIdPipe) code: string) {
    return await this.settingService.findByCode(code);
  }
}
