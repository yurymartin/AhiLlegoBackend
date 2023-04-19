import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import * as path from 'path';

@Injectable()
export class ConnectionService {
  constructor(private configService: ConfigService) {}

  initializeFirebase() {
    try {
      const serviceAccount = this.configService.get<string>(
        'FIREBASE_CREDENTIALS',
      );
      const absolutePath = path.join(__dirname, '../../../../', serviceAccount);

      const app = admin.initializeApp({
        credential: admin.credential.cert(absolutePath),
      });
      return app;
    } catch (ex) {
      console.log('ERROR initializeFirebase', ex);
    }
  }
}
