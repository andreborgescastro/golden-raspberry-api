export interface AwardIntervalItem {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export interface AwardIntervalsResponse {
  min: AwardIntervalItem[];
  max: AwardIntervalItem[];
}