import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PayloadToken } from '../../schemas/token.schema';
import { User } from '../../../users/schemas/user.schema';
import { UserService } from '../../../users/services/user/user.service';
import { CreateRegisterCustomerDto } from '../../dtos/registerCustomer.dto';
import { UserSessionService } from '../../../users/services/user-session/user-session.service';
import { CreateSignInCustomerDto } from '../../dtos/signInCustomer.dto';
import {
  PROFILE_ADMIN_ID,
  PROFILE_CUSTOMER_ID,
  PROFILE_DELIVERY_MAN_ID,
  PROFILE_ENTERPRISE_ID,
} from '../../../common/constants';
import { CreateDeliveryManDto } from '../../dtos/deliveryMan.dto';
import { BcryptService } from '../bcrypt/bcrypt.service';
import { CreateLoginDeliveryManDto } from '../../dtos/deliveryManLogin.dto';
import { ConfigService } from '@nestjs/config';
import { CompanyService } from '../../../companies/services/company/company.service';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private companyService: CompanyService,
    private userSessionService: UserSessionService,
    private bcryptService: BcryptService,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async loginAdministrator(data: CreateLoginDeliveryManDto): Promise<any> {
    this.logger.log('[loginAdministrator DATA] =>', data);
    let user = await this.userService.findOneByDocumentNumber(
      data.documentNumber,
    );
    if (!user || String(user.profileId) !== PROFILE_ADMIN_ID) {
      throw new BadRequestException('Credenciales Incorrectas');
    }
    if (!user.status) {
      throw new BadRequestException('El usuario se encuentra inactivo');
    }
    let validatePassword = this.bcryptService.validatePassword(
      String(data.password),
      String(user.password),
    );
    if (!validatePassword) {
      throw new BadRequestException('Credenciales Incorrectas');
    }
    let tokenJwt = this.generateJWT(user);
    let userSession = await this.userSessionService.findOnebyUser(user._id);
    let newSession: any = null;
    let body: any = {
      token: tokenJwt,
      tokenDevice: data.tokenDevice || '',
      status: true,
      profileId: user.profileId,
    };
    if (userSession) {
      newSession = await this.userSessionService.update(userSession._id, body);
    } else {
      body.userId = user._id;
      newSession = await this.userSessionService.create(body);
    }
    return newSession;
  }

  async loginDeliveryMan(data: CreateLoginDeliveryManDto) {
    this.logger.log('[loginDeliveryMan DATA] =>', data);
    let user = await this.userService.findOneByDocumentNumber(
      data.documentNumber,
    );
    if (!user || String(user.profileId) !== PROFILE_DELIVERY_MAN_ID) {
      throw new BadRequestException('Credenciales Incorrectas');
    }
    if (!user.status) {
      throw new BadRequestException('El usuario se encuentra inactivo');
    }
    let validatePassword = this.bcryptService.validatePassword(
      String(data.password),
      String(user.password),
    );
    if (!validatePassword) {
      throw new BadRequestException('Credenciales Incorrectas');
    }
    let tokenJwt = this.generateJWT(user);
    let userSession = await this.userSessionService.findOnebyUser(user._id);
    let newSession: any = null;
    let body: any = {
      token: tokenJwt,
      tokenDevice: data.tokenDevice || '',
      status: true,
      profileId: user.profileId,
    };
    if (userSession) {
      newSession = await this.userSessionService.update(userSession._id, body);
    } else {
      body.userId = user._id;
      newSession = await this.userSessionService.create(body);
    }
    return newSession;
  }

  async loginEnterprise(data: CreateLoginDeliveryManDto) {
    this.logger.log('[loginDeliveryMan DATA] =>', data);
    let user = await this.userService.findOneByDocumentNumber(
      data.documentNumber,
    );
    let company = await this.companyService.findByUserId(user._id);
    if (!company.status) {
      throw new BadRequestException(
        'La empresa se encuentra inactivo, comuniquese con la administración de ahi-llego',
      );
    }

    if (!user || String(user.profileId) !== PROFILE_ENTERPRISE_ID) {
      throw new NotFoundException('credenciales incorrectas');
    }
    if (!user.status) {
      throw new BadRequestException(
        'El usuario se encuentra inactivo, comuniquese con la administración de ahi-llego',
      );
    }
    let validatePassword = this.bcryptService.validatePassword(
      String(data.password),
      String(user.password),
    );
    if (!validatePassword) {
      throw new BadRequestException('Credenciales Incorrectas');
    }
    let tokenJwt = this.generateJWT(user);
    let userSession = await this.userSessionService.findOnebyUser(user._id);
    let newSession: any = null;
    let body: any = {
      token: tokenJwt,
      tokenDevice: data.tokenDevice || '',
      status: true,
      profileId: user.profileId,
    };

    if (userSession) {
      newSession = await this.userSessionService.update(userSession._id, body);
    } else {
      body.userId = user._id;
      newSession = await this.userSessionService.create(body);
    }
    let result = {
      token: tokenJwt,
      userId: user._id,
      profileId: user.profileId,
      companyId: company._id,
      logo: company.logo,
      name: company.name,
      description: company.description,
    };
    return result;
  }

  async signInCustomer(data: CreateSignInCustomerDto): Promise<any> {
    this.logger.log('[signInCustomer DATA] =>', data);
    let user = await this.userService.findOneByPhone(data.phone);
    if (!user) {
      throw new NotFoundException(`El usuario no existe`);
    }
    if (!user.status) {
      throw new BadRequestException(
        'Tu cuenta se encuentra en estado inactivo. Porfavor comunicarte con soporte Gracias',
      );
    }
    //*create a new user_session
    let tokenJwt = this.generateJWT(user);
    let body: any = {
      token: tokenJwt,
      tokenDevice: data.tokenDevice || '',
      status: true,
      profileId: user.profileId,
    };
    let userSession = await this.userSessionService.findOnebyUser(user._id);
    let newSession: any = null;
    if (userSession) {
      newSession = await this.userSessionService.update(userSession._id, body);
    } else {
      body.userId = user._id;
      newSession = await this.userSessionService.create(body);
    }
    return newSession;
  }

  async createCustomer(data: CreateRegisterCustomerDto): Promise<any> {
    //* create a new user
    this.logger.log('[createCustomer DATA] =>', data);
    let user = await this.userService.findOneByPhone(data.phone);
    if (user) {
      throw new BadRequestException(
        'Tu número de celular ya se encuentra registrado, Ya puedes realizar pedidos',
      );
    }
    data.profileId = PROFILE_CUSTOMER_ID;
    let userSave = await this.userService.create(data);

    //*create a new user_session
    let tokenJwt = this.generateJWT(userSave);
    let body: any = {
      token: tokenJwt,
      tokenDevice: data.tokenDevice || '',
      profileId: userSave.profileId,
    };
    let userSession = await this.userSessionService.findOnebyUser(userSave._id);
    let newSession: any = null;
    if (userSession) {
      newSession = await this.userSessionService.update(userSession._id, body);
    } else {
      body.userId = userSave._id;
      newSession = await this.userSessionService.create(body);
    }
    return newSession;
  }

  async createDeliveryMan(data: CreateDeliveryManDto) {
    data.profileId = PROFILE_DELIVERY_MAN_ID;
    data.password = this.bcryptService.generate(data.password);
    let userSave = await this.userService.create(data);
    return userSave;
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  generateJWT(user: User) {
    const payload: PayloadToken = {
      profileId: user.profileId._id,
      userId: user._id,
    };
    const secretKey = this.configService.get<string>('KEY_SECRET_JWT');
    let token = this.jwtService.sign(payload, { secret: secretKey });
    return token;
  }
}
