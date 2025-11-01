import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AwardsService } from './awards.service';
import { AwardIntervalsResponse } from './dto/award-intervals.response';

@Controller('awards')
export class AwardsController {
  constructor(private readonly awardsService: AwardsService) {}

  @Get('intervals')
  async intervals(): Promise<AwardIntervalsResponse> {
    return this.awardsService.getIntervals();
  }
}
