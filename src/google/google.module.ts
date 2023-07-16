import { Module } from '@nestjs/common';
import { MapsService } from './services/maps/maps.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [MapsService],
  exports: [MapsService],
})
export class GoogleModule {}
