import { Injectable } from '@nestjs/common';
import { AwardIntervalsResponse } from './dto/award-intervals.response';
import { AwardsRepository } from './awards.repository';

@Injectable()
export class AwardsService {
  constructor(private readonly repo: AwardsRepository) {}
  async getIntervals(): Promise<AwardIntervalsResponse> {

    const { min, max } = await this.repo.getIntervalsMinMaxRaw();
    
    return {
      min: min.map(r => ({
        producer: r.producer,
        interval: r.interval,
        previousWin: r.previousWin,
        followingWin: r.followingWin,
      })),
      max: max.map(r => ({
        producer: r.producer,
        interval: r.interval,
        previousWin: r.previousWin,
        followingWin: r.followingWin,
      })),
    };
  }
}
