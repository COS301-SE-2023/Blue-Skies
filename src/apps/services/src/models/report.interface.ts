export default interface IReport {
  reportId: number;
  userId: number;
  systemId: number;
  solarScore: number;
  latitude: number;
  longitude: number;
  light: number;
  batteryLife: number;
  payOffTime: number;
  parameter: string;
}
