import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { MongoIdPipe } from '../../../common/pipe/mongo-id/mongo-id.pipe';
import { CreateCompanyDto, UpdateCompanyDto } from '../../dtos/Company.dto';
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

  @Patch('/:id')
  async update(
    @Param('id', MongoIdPipe) id: string,
    @Body() payload: UpdateCompanyDto,
  ) {
    return await this.companyService.update(id, payload);
  }
}
