import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompanyService } from '../../../companies/services/company/company.service';
import { TypeProductService } from '../type-product/type-product.service';
import { CreateProductDto } from '../../dtos/product.dto';
import { Product } from '../../schemas/product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
    private readonly companyService: CompanyService,
    private readonly typeProductService: TypeProductService,
  ) {}

  async findOne(id: string) {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('No se encontro el producto');
    }
    return product;
  }

  async finByTypeProductCompany(
    typeproductId: string | any,
    companyId: string | any,
  ) {
    let company = await this.companyService.findOne(companyId);
    let typeProduct = await this.typeProductService.findOne(typeproductId);
    const products = await this.productModel
      .find({
        typeProductId: typeProduct._id,
        companyId: company._id,
      })
      .select('-createdAt -updatedAt -__v')
      .exec();

    return products || [];
  }

  async create(data: CreateProductDto) {
    let company = await this.companyService.findOne(data.companyId);
    let typeProduct = await this.typeProductService.findOne(data.typeProductId);
    data.companyId = company;
    data.typeProductId = typeProduct;
    const newProduct = new this.productModel(data);
    const productSave = await newProduct.save();
    return productSave;
  }
}
