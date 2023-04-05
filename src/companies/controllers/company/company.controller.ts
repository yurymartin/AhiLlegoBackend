import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MongoIdPipe } from '../../../common/pipe/mongo-id/mongo-id.pipe';
import { CreateCompanyDto } from '../../dtos/Company.dto';
import { CompanyService } from '../../services/company/company.service';

@Controller('company')
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Get()
  async findAll() {
    return await this.companyService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id', MongoIdPipe) id: string) {
    return await this.companyService.findOne(id);
  }

  @Get('/business-line-detail/:id')
  async findByBusinessLineDetailId(@Param('id', MongoIdPipe) id: string) {
    return await this.companyService.findByBusinessLineDetailId(id);
  }

  @Post()
  async create(@Body() payload: CreateCompanyDto) {
    return await this.companyService.create(payload);
  }
}
