export default interface IReport {
  reportId: number;
  reportName: string;
  userId: number;
  systemId: number;
  latitude: number;
  longitude: number;
  dateCreated: Date;
}
