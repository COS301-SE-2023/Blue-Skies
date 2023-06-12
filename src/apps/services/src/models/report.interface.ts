export default interface IReport {
  reportId: number;
  reportName: string;
  userId: number;
  basicCalculationId: number;
  solarScore: number;
  runningTime: number;
  dateCreated: Date;
}
