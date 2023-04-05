import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SALT_OR_ROUNDS } from '../../../common/constants';

@Injectable()
export class BcryptService {
  generate(password: string) {
    const salt = bcrypt.genSaltSync(SALT_OR_ROUNDS);
    const hashedPassword = bcrypt.hashSync(password, salt);
    return hashedPassword;
  }

  validatePassword(passwordToCheck: string, hashedPassword: string) {
    const result = bcrypt.compareSync(passwordToCheck, hashedPassword);
    return result;
  }
}
