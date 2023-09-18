import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './../users/schemas/user.schema';
import {
  UserSession,
  UserSessionSchema,
} from './../users/schemas/userSession.schema';
import { OtpController } from './controllers/otp/otp.controller';
import { Otp, OtpSchema } from './schemas/otp.schema';
import { OtpService } from './services/otp/otp.service';
import { AuthService } from './services/auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import config from './../config/configuration';
import { ConfigType } from '@nestjs/config';
import { AuthController } from './controllers/auth/auth.controller';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { BcryptService } from './services/bcrypt/bcrypt.service';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Otp.name,
        schema: OtpSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: UserSession.name,
        schema: UserSessionSchema,
      },
    ]),
    CompaniesModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        const { keySecret, timeExpiry } = configService.jwt;
        return {
          secret: keySecret,
          signOptions: {
            expiresIn: timeExpiry,
          },
        };
      },
    }),
  ],
  controllers: [OtpController, AuthController],
  providers: [
    OtpService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    BcryptService,
  ],
})
export class AuthModule {}
