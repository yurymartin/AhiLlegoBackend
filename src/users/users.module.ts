import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileController } from './controllers/profile/profile.controller';
import { ProfileService } from './services/profile/profile.service';
import { DocumentTypeController } from './controllers/document-type/document-type.controller';
import { DocumentTypeService } from './services/document-type/document-type.service';

import { Profile, ProfileSchema } from './schemas/profile.schema';
import { DocumentType, DocumentTypeSchema } from './schemas/documentType.shema';
import { User, UserSchema } from './schemas/user.schema';
import { UserSession, UserSessionSchema } from './schemas/userSession.schema';
import { UserController } from './controllers/user/user.controller';
import { UserService } from './services/user/user.service';
import { UserSessionService } from './services/user-session/user-session.service';
import { AddressesModule } from '../addresses/addresses.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DocumentType.name,
        schema: DocumentTypeSchema,
      },
      {
        name: Profile.name,
        schema: ProfileSchema,
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
    forwardRef(() => AddressesModule),
  ],
  controllers: [ProfileController, DocumentTypeController, UserController],
  providers: [
    ProfileService,
    DocumentTypeService,
    UserService,
    UserSessionService,
  ],
  exports: [
    ProfileService,
    DocumentTypeService,
    UserService,
    UserSessionService,
  ],
})
export class UsersModule {}
