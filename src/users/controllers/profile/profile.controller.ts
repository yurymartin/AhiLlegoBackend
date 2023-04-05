import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProfileService } from './../../services/profile/profile.service';
import { CreateProfileDto, UpdateProfileDto } from './../../dtos/profile.dto';
import { MongoIdPipe } from '../../../common/pipe/mongo-id/mongo-id.pipe';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get()
  async findAll() {
    return await this.profileService.findAll();
  }

  @Get(':id')
  async finOne(@Param('id', MongoIdPipe) id: string) {
    return await this.profileService.findOne(id);
  }

  @Post()
  async create(@Body() payload: CreateProfileDto) {
    return await this.profileService.create(payload);
  }

  @Put(':id')
  async update(
    @Param('id', MongoIdPipe) id: string,
    @Body() payload: UpdateProfileDto,
  ) {
    return await this.profileService.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id', MongoIdPipe) id: string) {
    return await this.profileService.remove(id);
  }
}
