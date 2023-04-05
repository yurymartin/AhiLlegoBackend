import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { User } from './../../schemas/user.schema';

import { CreateUserDto, UpdateUserDto } from './../../dtos/user.dto';
import { ProfileService } from '../profile/profile.service';
import { DocumentTypeService } from '../document-type/document-type.service';
import { AddressService } from '../../../addresses/services/address/address.service';
import { PROFILE_DELIVERY_MAN_ID } from '../../../common/constants';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly profileService: ProfileService,
    private readonly documentTypeService: DocumentTypeService,
    @Inject(forwardRef(() => AddressService))
    private readonly addressService: AddressService,
  ) {}

  async findAll() {
    let users = await this.userModel.find({});
    return users;
  }

  async findOne(id: string | any): Promise<User> {
    let userSearch = await this.userModel
      .findById(id)
      .select('-password -createdAt -updatedAt -__v')
      .exec();
    if (!userSearch) {
      throw new NotFoundException(`El usuario no existe`);
    }
    if (!userSearch.status) {
      throw new BadRequestException(
        'El usuario se encuentra en estado desactivado',
      );
    }
    return userSearch;
  }

  async findAllDeliveryMan(): Promise<User[]> {
    let profile = await this.profileService.findOne(PROFILE_DELIVERY_MAN_ID);
    let deliveryMans = await this.userModel
      .find({ profileId: profile._id })
      .select('-password -createdAt -updatedAt -__v')
      .exec();
    return deliveryMans;
  }

  async findOneWithAddress(id: string): Promise<User | any> {
    let userSearch = await this.userModel
      .findById(id)
      .select('-password -createdAt -updatedAt -__v')
      .exec();
    if (!userSearch) {
      throw new NotFoundException(`El usuario no existe`);
    }
    let address = await this.addressService.findOneActiveByUserId(
      userSearch._id,
    );
    return {
      data: userSearch,
      address: address,
    };
  }

  async findOneByPhone(phone: string): Promise<User | undefined> {
    let user = await this.userModel.findOne({ phone });
    return user;
  }

  async findOneByDocumentNumber(documentNumber: string) {
    const user = await this.userModel.findOne({
      documentNumber: documentNumber,
    });
    return user;
  }

  async findOneByDocumentUser(
    documentNumber: string,
    documentType: string = '1',
  ) {
    const customer = await this.userModel
      .findOne({
        documentNumber: documentNumber,
        documentType: documentType,
      })
      .exec();
    return customer;
  }

  async create(data: CreateUserDto): Promise<User | undefined> {
    const { documentNumber, documentTypeId, profileId, phone } = data;
    if (documentTypeId) {
      let documentType = await this.documentTypeService.findOne(
        String(documentTypeId),
      );
      data.documentTypeId = documentType;
    }
    if (documentNumber) {
      let userWithDocumentRepeit = await this.findOneByDocumentUser(
        documentNumber,
        String(documentTypeId),
      );

      if (userWithDocumentRepeit) {
        throw new BadRequestException(
          `Lo siento, el número de documento y tipo que está intentando agregar ya está en uso. Por favor, elija otro y vuelva a intentarlo.`,
        );
      }
    }
    let profile = await this.profileService.findOne(String(profileId));
    data.profileId = profile;
    let userPhone = await this.findOneByPhone(phone);
    if (userPhone) {
      throw new BadRequestException(
        `Lo siento, el número de celular que está intentando agregar ya está en uso. Por favor, elija otro y vuelva a intentarlo.`,
      );
    }
    let newUser = new this.userModel(data);
    let userSave = await newUser.save();
    if (!userSave) {
      throw new InternalServerErrorException('Error al registrar el usuario');
    }
    return userSave;
  }

  async update(userId: string, data: UpdateUserDto) {
    if (data.documentTypeId) {
      let documentType = await this.documentTypeService.findOne(
        String(data.documentTypeId),
      );
      data.documentTypeId = documentType;
    }

    if (data.documentNumber) {
      let userWithDocumentRepeit = await this.findOneByDocumentUser(
        data.documentNumber,
        String(data.documentTypeId),
      );

      if (userWithDocumentRepeit) {
        throw new BadRequestException(
          `Existe un usuario con el numero de documento y tipo`,
        );
      }
    }

    if (data.profileId) {
      let profile = await this.profileService.findOne(String(data.profileId));
      data.profileId = profile;
    }

    if (data.phone) {
      let userPhone = await this.findOneByPhone(data.phone);
      if (userPhone) {
        throw new BadRequestException(`El número de celular ya existe`);
      }
    }

    let userUpdate = await this.userModel.findByIdAndUpdate(userId, data, {
      new: true,
    });

    if (!userUpdate) {
      throw new InternalServerErrorException('Error al actualizar el usuario');
    }
    return userUpdate;
  }
}
