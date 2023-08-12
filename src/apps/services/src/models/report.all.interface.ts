export default interface IReportAll {
  userId: number;
  email: string;
  password: string;
  userRole: number;
  userDateCreated: Date;
  lastLoggedIn: Date;
  reportId: number;
  reportName: string;
  solarIrradiationId: number;
  daylightHours: number;
  location: string;
  reportDateCreated: Date;
  systemId: number;
  systemSize: number;
  inverterOutput: number;
  numberOfPanels: number;
  batterySize: number;
  numberOfBatteries: number;
  solarInput: number;
  image: string;
}
