export default interface IReport {
  reportId: number;
  reportName: string;
  userId: number;
  solarIrradiationId: number;
  systemId: number;
  dayLightHours: number;
  location: string;
  image: string;
  dateCreated: Date;
}
