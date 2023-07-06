import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MongoIdPipe } from '../../../common/pipe/mongo-id/mongo-id.pipe';
import { CreateProductDto } from '../../dtos/product.dto';
import { ProductService } from './../../services/product/product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('/type-product/:typeproductId/company/:companyId')
  async finByTypeProductCompany(
    @Param('typeproductId', MongoIdPipe) typeproductId: string,
    @Param('companyId', MongoIdPipe) companyId: string,
  ) {
    return await this.productService.finByTypeProductCompany(
      typeproductId,
      companyId,
    );
  }

  @Post()
  async create(@Body() payload: CreateProductDto) {
    return await this.productService.create(payload);
  }

  @Post('/aument/price')
  async insertMassive(@Body() payload: any) {
    return await this.productService.aumentPrice(payload);
  }
}
