import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  initApp(): string {
    const env = this.configService.get<string>('ENV');
    return `Ahi-Llego - ${env}`;
  }
}
