import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  CreateCompanyDto,
  UpdateCompanyDto,
} from 'src/companies/dtos/Company.dto';
import { UserService } from '../../../users/services/user/user.service';
import { ProfileService } from '../../../users/services/profile/profile.service';
import { DocumentTypeService } from '../../../users/services/document-type/document-type.service';
import { BusinessLineDetailService } from '../../services/business-line-detail/business-line-detail.service';
import { Company } from '../../schemas/company.schema';
import { encryptPassword } from './../../../common/helper/bcrypt';
import { CreateUserDto } from 'src/users/dtos/user.dto';
import { PROFILE_ENTERPRISE_ID } from '../../../common/constants';
import { format, getDay, isWithinInterval, parse } from 'date-fns';

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
    const company = await this.companyModel
      .findOne({ _id: new Types.ObjectId(id) })
      .exec();
    if (!company) {
      throw new NotFoundException(`No se encontro la empresa`);
    }
    return company;
  }

  async findByUserId(userId: string | any) {
    const company = await this.companyModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .exec();
    if (!company) {
      throw new NotFoundException(`No se encontro la empresa`);
    }
    return company;
  }

  async findByBusinessLineDetailId(businessLineDetailId: string) {
    let businessLine = await this.businessLineDetailService.findOne(
      businessLineDetailId,
    );

    const dayCurrentId = getDay(new Date());
    const timeCurrent = format(new Date(), 'HH:mm:ss');
    console.log('[dayCurrentId] =>', dayCurrentId);
    console.log('[timeCurrent] =>', timeCurrent);

    let companies = await this.companyModel
      .find({
        businessLineDetailId: businessLine._id,
        status: true,
      })
      // .sort({ createdAt: 1 })
      .exec();

    let companiesNew = companies.map((company) => {
      const isOpen = this.handlerIsOpen(company, timeCurrent, dayCurrentId);
      return {
        ...company.toObject(),
        isOpen: isOpen,
      };
    });

    return companiesNew;
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

  async update(id: String, data: UpdateCompanyDto) {
    const company = await this.companyModel.findOne({ _id: id }).exec();
    if (!company) {
      throw new NotFoundException(`No se encontro la empresa`);
    }
    const companyUpdate = await this.companyModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!companyUpdate) {
      throw new InternalServerErrorException('Error al actualizar  pedido');
    }
    return companyUpdate;
  }

  handlerIsOpen = (company: any, timeCurrent: any, dayCurrentId: any) => {
    const { schedule } = company;
    if (company.openDays.length <= 0) {
      return true;
    }
    if (!company.openDays.includes(dayCurrentId)) {
      return false;
    }
    if (!schedule.startTime || !schedule.endTime) {
      return false;
    }
    let startTime = parse(schedule.startTime, 'HH:mm:ss', new Date());
    let endTime = parse(schedule.endTime, 'HH:mm:ss', new Date());
    let timeCurrentFormat = parse(timeCurrent, 'HH:mm:ss', new Date());
    const intervalo = { start: startTime, end: endTime };
    const isValid = isWithinInterval(timeCurrentFormat, intervalo);
    if (isValid) {
      return true;
    }
    return false;
  };
}
