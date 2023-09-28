import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Profile } from '../../schemas/profile.schema';
import { CreateProfileDto, UpdateProfileDto } from '../../dtos/profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<Profile>,
  ) {}

  async findAll() {
    const profiles = await this.profileModel
      .find()
      .select('-createdAt -updatedAt -__v')
      .exec();
    return profiles;
  }

  async findOne(id: string) {
    const profile = await this.profileModel
      .findOne({ _id: new Types.ObjectId(id) })
      .select('-createdAt -updatedAt -__v')
      .exec();
    if (!profile) {
      throw new NotFoundException(`No se encontro el perfil de usuario`);
    }
    return profile;
  }

  async create(data: CreateProfileDto) {
    const newProfile = new this.profileModel(data);
    const profileSave = await newProfile.save();
    return profileSave;
  }

  async update(id: string, changes: UpdateProfileDto) {
    const profile = await this.profileModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();
    if (!profile) {
      throw new NotFoundException(`No se encontro el perfil de usuario`);
    }
    return profile;
  }

  async remove(id: string) {
    const profile = await this.profileModel.findOne({ _id: id }).exec();
    if (!profile) {
      throw new NotFoundException(`No se encontro el tipo de producto`);
    }
    const profileRemove = await this.profileModel.findByIdAndDelete(id);
    return profileRemove;
  }
}
