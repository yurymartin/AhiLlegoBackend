import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class ConnectionService {
  constructor(private configService: ConfigService) {}

  initializeFirebase() {
    try {
      const serviceAccount = this.configService.get<string>(
        'FIREBASE_CREDENTIALS',
      );

      const app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      return app;
    } catch (ex) {
      console.log('ERROR initializeFirebase', ex);
    }
  }
}
