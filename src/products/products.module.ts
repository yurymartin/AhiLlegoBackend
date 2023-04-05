import { Module } from '@nestjs/common';
import { TypeProductService } from './services/type-product/type-product.service';
import { TypeProductController } from './controllers/type-product/type-product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeProduct, TypeProductSchema } from './schemas/typeProduct.schema';
import {
  TypeProductCompany,
  TypeProductCompanySchema,
} from './schemas/typeProductCompany.schema';
import { TypeProductCompanyController } from './controllers/type-product-company/type-product-company.controller';
import { TypeProductCompanyService } from './services/type-product-company/type-product-company.service';
import { CompaniesModule } from '../companies/companies.module';
import { ProductController } from './controllers/product/product.controller';
import { ProductService } from './services/product/product.service';
import { Product, ProductSchema } from './schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
      {
        name: TypeProduct.name,
        schema: TypeProductSchema,
      },
      {
        name: TypeProductCompany.name,
        schema: TypeProductCompanySchema,
      },
    ]),
    CompaniesModule,
  ],
  controllers: [
    TypeProductController,
    TypeProductCompanyController,
    ProductController,
  ],
  providers: [TypeProductService, TypeProductCompanyService, ProductService],
  exports: [ProductService],
})
export class ProductsModule {}
