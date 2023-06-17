import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BusinessLineDetail } from '../../schemas/businessLineDetail.schema';
import { CreateBusinessLineDetailDto } from '../../dtos/businessLineDetail.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessLineService } from '../business-line/business-line.service';

@Injectable()
export class BusinessLineDetailService {
  constructor(
    @InjectModel(BusinessLineDetail.name)
    private readonly businessLineDetailModel: Model<BusinessLineDetail>,
    private readonly businessLineService: BusinessLineService,
  ) {}

  async findAll() {
    const businessLines = await this.businessLineDetailModel
      .find()
      .select('-createdAt -updatedAt -__v')
      .exec();
    return businessLines;
  }

  async findOne(id: string) {
    const businessLine = await this.businessLineDetailModel
      .findOne({ _id: id })
      .exec();
    if (!businessLine) {
      throw new NotFoundException(`No existe el giro de negocio`);
    }
    return businessLine;
  }

  async findByBusinessLine(businessLineId: string) {
    let businessLine = await this.businessLineService.findOne(businessLineId);
    const businessLines = await this.businessLineDetailModel
      .find({ businessLineId: businessLine._id, status: true })
      .exec();
    return businessLines;
  }

  async create(data: CreateBusinessLineDetailDto) {
    let businessLine = await this.businessLineService.findOne(
      data.businessLineId.toString(),
    );

    data.businessLineId = businessLine;

    const newBusinessLine = new this.businessLineDetailModel(data);
    const businessLineSave = await newBusinessLine.save();
    if (!businessLineSave) {
      throw new InternalServerErrorException(
        `Error al registrar el detalle del giro de negocio`,
      );
    }
    return businessLineSave;
  }
}
