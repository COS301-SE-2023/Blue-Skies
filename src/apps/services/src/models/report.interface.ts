export default interface IReport {
  reportId: number;
  reportName: string;
  userId: number;
  systemId: number;
  daylightHours: number;
  locationId: number;
  image: string;
  dateCreated: Date;
}
