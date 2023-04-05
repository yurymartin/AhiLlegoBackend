import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAddressDto } from '../../dtos/address.dto';
import { UserService } from '../../../users/services/user/user.service';
import { Address } from '../../schemas/address.schema';
import { TypeAddressService } from '../type-address/type-address.service';
import { StreetService } from '../street/street.service';

interface IpayloadUpdate {
  addressId: string;
}

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address.name)
    private readonly addressModel: Model<Address>,
    private readonly typeAddressService: TypeAddressService,
    private readonly streetService: StreetService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  async findAll() {
    const addresses = await this.addressModel.find({}).exec();
    return addresses;
  }

  async findOne(id: string): Promise<any> {
    const address = await this.addressModel
      .findOne({ _id: id })
      .populate('streetId')
      .exec();
    if (!address) {
      throw new NotFoundException('No existe la dirección');
    }
    return address;
  }

  async findByUserId(userId: string) {
    const user = await this.userService.findOne(userId);
    const addresses = await this.addressModel.find({ userId: user._id }).exec();
    return addresses;
  }

  async findOneActiveByUserId(userId: string) {
    const user = await this.userService.findOne(userId);

    const addresses = await this.addressModel
      .findOne({ userId: user._id, status: true })
      .populate('typeAddressId streetId', '-createdAt -updatedAt -__v')
      .select('-createdAt -updatedAt -__v')
      .exec();
    return addresses;
  }

  async create(data: CreateAddressDto) {
    let addresses = await this.findByUserId(data.userId.toString());

    if (addresses && addresses.length <= 0) {
      data.status = true;
    }

    const user = await this.userService.findOne(data.userId.toString());

    const typeAddress = await this.typeAddressService.findOne(
      data.typeAddressId.toString(),
    );

    const street = await this.streetService.findOne(data.streetId.toString());

    data.userId = user;
    data.typeAddressId = typeAddress;
    data.streetId = street;

    const newAddress = new this.addressModel(data);
    const AddressSave = await newAddress.save();
    if (!AddressSave) {
      throw new InternalServerErrorException('Error al registrar la dirección');
    }
    return AddressSave;
  }

  async updateStatusAddressCustomer(customerId: string, data: IpayloadUpdate) {
    let addresses = await this.findByUserId(customerId);

    if (addresses && addresses.length > 0) {
      for (const address of addresses) {
        await this.addressModel.findByIdAndUpdate(address._id, {
          $set: { status: false },
        });
      }
    }

    let addressUpdate = await this.addressModel.findByIdAndUpdate(
      data.addressId,
      { $set: { status: true } },
      { new: true },
    );

    return addressUpdate;
  }

  async delete(id: string) {
    const address = await this.addressModel.findOne({ _id: id });
    if (address) {
      if (address.status === true) {
        throw new BadRequestException(
          'Nose puede eliminar una dirección activa, cambie su dirección activa porfavor',
        );
      }
    } else {
      throw new NotFoundException('No existe la dirección a eliminar');
    }
    const addressDelete = await this.addressModel.findByIdAndDelete(id);
    if (!addressDelete) {
      throw new InternalServerErrorException('Error al eliminar la dirección');
    }
    return addressDelete;
  }
}
