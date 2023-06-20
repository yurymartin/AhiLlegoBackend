import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompanyService } from '../../../companies/services/company/company.service';
import { CreateTypeProductCompanyDto } from '../../dtos/typeProductCompany.dto';
import { TypeProductCompany } from '../../schemas/typeProductCompany.schema';
import { TypeProductService } from '../type-product/type-product.service';

@Injectable()
export class TypeProductCompanyService {
  constructor(
    @InjectModel(TypeProductCompany.name)
    private readonly TypeProductCompanyModel: Model<TypeProductCompany>,
    private readonly companyService: CompanyService,
    private readonly typeProductService: TypeProductService,
  ) {}

  async findAll() {
    const typeProductsCompany = await this.TypeProductCompanyModel.find()
      .select('-createdAt -updatedAt -__v')
      .exec();
    return typeProductsCompany;
  }

  async findByCompanyId(id: string) {
    try {
      let company = await this.companyService.findOne(id);
      const typeProductsCompany = await this.TypeProductCompanyModel.find({
        companyId: company._id,
        status: true,
      })
        .populate('typeProductId', '-createdAt -updatedAt -__v')
        .select('-createdAt -updatedAt -__v')
        .exec();
      return typeProductsCompany;
    } catch (ex) {
      throw new InternalServerErrorException(
        'Ocurrio un error al obtener los tipos de productos por empresa',
        ex,
      );
    }
  }

  async findOne(id: string) {
    const typeProductCompany = await this.TypeProductCompanyModel.findOne({
      _id: id,
    })
      .select('-createdAt -updatedAt -__v')
      .exec();
    if (!typeProductCompany) {
      throw new NotFoundException(`No se encontro el tipo de producto`);
    }
    return typeProductCompany;
  }

  async create(data: CreateTypeProductCompanyDto) {
    let company = await this.companyService.findOne(data.companyId);
    let typeProduct = await this.typeProductService.findOne(data.typeProductId);
    let typeProductCompany = await this.TypeProductCompanyModel.findOne({
      companyId: company._id,
      typeProductId: typeProduct._id,
    });

    if (typeProductCompany) {
      throw new BadRequestException(
        `La empresa ya tiene asociado el tipo de producto`,
      );
    }
    data.companyId = company;
    data.typeProductId = typeProduct;
    let body = {
      companyId: company,
      typeProductId: typeProduct,
    };
    const newTypeProduct = new this.TypeProductCompanyModel(body);
    const typeProductSave = await newTypeProduct.save();
    return typeProductSave;
  }
}
