import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateStreetDto } from '../../dtos/street.dto';
import { StreetService } from '../../services/street/street.service';

@Controller('street')
export class StreetController {
  constructor(private streetService: StreetService) {}

  @Get()
  async findAll() {
    return await this.streetService.findAll();
  }

  @Post()
  async create(@Body() payload: CreateStreetDto) {
    return await this.streetService.create(payload);
  }
}
