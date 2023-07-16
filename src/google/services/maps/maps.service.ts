import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

@Injectable()
export class MapsService {
  constructor(private readonly httpService: HttpService) {}

  getDistanceMatrix(
    origin: string,
    destination: string,
  ): Observable<AxiosResponse<any>> {
    console.log('[ORIGIN_DISTANCE_MATRIX] =>', origin);
    console.log('[DESTINATION_DISTANCE_MATRIX] =>', destination);
    const apiKey = 'AIzaSyCRxikD3HuzXXadc6Tk4ehj1vlOVkD5VQk';
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin}&destinations=${destination}&units=metric&key=${apiKey}`;
    return this.httpService.get(url);
  }
}
