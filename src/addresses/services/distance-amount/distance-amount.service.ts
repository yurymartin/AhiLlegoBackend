import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDistanceAmountDto } from '../../dtos/distanceAmount.dto';
import { DistanceAmount } from '../../schemas/distanceAmount.schema';

@Injectable()
export class DistanceAmountService {
  constructor(
    @InjectModel(DistanceAmount.name)
    private readonly distanceAmountModel: Model<DistanceAmount>,
  ) {}

  async getAll() {
    const distanceAmounts = await this.distanceAmountModel
      .find({
        status: true,
      })
      .exec();
    return distanceAmounts;
  }

  async getByDistance(distance: number) {
    const distanceAmount = await this.distanceAmountModel
      .findOne({
        minDistance: { $lte: distance },
        maxDistance: { $gte: distance },
      })
      .exec();
    return distanceAmount;
  }

  async create(data: CreateDistanceAmountDto) {
    const newDistanceAmount = new this.distanceAmountModel(data);
    const distanceAmountSave = await newDistanceAmount.save();
    if (!distanceAmountSave) {
      throw new InternalServerErrorException(
        'Error la distancia de costo para el delivery',
      );
    }
    return distanceAmountSave;
  }
}
