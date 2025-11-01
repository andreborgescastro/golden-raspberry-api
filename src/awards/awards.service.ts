import { Injectable } from '@nestjs/common';
import { AwardIntervalsResponse } from './dto/award-intervals.response';

@Injectable()
export class AwardsService {
  async getIntervals(): Promise<AwardIntervalsResponse> {
    return { min: [], max: [] };
  }
}
