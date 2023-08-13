export default interface IReport {
  reportId: number;
  reportName: string;
  userId: number;
  systemId: number;
  locationId: number;
  daylightHours: number;
  image: string;
  dateCreated: Date;
}
