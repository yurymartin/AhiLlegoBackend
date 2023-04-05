import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCompanyDto } from 'src/companies/dtos/Company.dto';
import { UserService } from '../../../users/services/user/user.service';
import { ProfileService } from '../../../users/services/profile/profile.service';
import { DocumentTypeService } from '../../../users/services/document-type/document-type.service';
import { BusinessLineDetailService } from '../../services/business-line-detail/business-line-detail.service';
import { Company } from '../../schemas/company.schema';
import { encryptPassword } from './../../../common/helper/bcrypt';
import { CreateUserDto } from 'src/users/dtos/user.dto';
import { PROFILE_ENTERPRISE_ID } from '../../../common/constants';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: Model<Company>,
    private readonly userService: UserService,
    private readonly documentTypeService: DocumentTypeService,
    private readonly profileService: ProfileService,
    private readonly businessLineDetailService: BusinessLineDetailService,
  ) {}

  async findAll(): Promise<Company[] | undefined> {
    let companies = await this.companyModel.find().exec();
    return companies;
  }

  async findOne(id: string | any) {
    const company = await this.companyModel.findOne({ _id: id }).exec();
    if (!company) {
      throw new NotFoundException(`No se encontro la empresa`);
    }
    return company;
  }

  async findByBusinessLineDetailId(businessLineDetailId: string) {
    let businessLine = await this.businessLineDetailService.findOne(
      businessLineDetailId,
    );

    let companies = await this.companyModel
      .find({
        businessLineDetailId: businessLine._id,
      })
      // .sort({ createdAt: 1 })
      .exec();
    return companies;
  }

  async create(data: CreateCompanyDto) {
    let businessLine = await this.businessLineDetailService.findOne(
      data.businessLineDetailId,
    );

    let password = await encryptPassword(data.password);
    let bodyUser: CreateUserDto = {
      documentTypeId: data.documentTypeId,
      documentNumber: data.documentNumber,
      name: data.nameUser,
      surname: data.surnameUser,
      email: data.email,
      phone: data.phone,
      password: password,
      profileId: PROFILE_ENTERPRISE_ID,
      credit: null,
    };
    let user = await this.userService.create(bodyUser);

    let bodyCompany = {
      name: data.name,
      description: data.description,
      commission: data.commission,
      ruc: data.ruc,
      logo: data.logo,
      image: data.image,
      contract: data.contract,
      businessLineDetailId: businessLine,
      userId: user,
    };

    let newCompany = new this.companyModel(bodyCompany);
    let companySave = await newCompany.save();

    if (!companySave) {
      throw new InternalServerErrorException('Error al registrar la empresa');
    }
    return companySave;
  }
}
