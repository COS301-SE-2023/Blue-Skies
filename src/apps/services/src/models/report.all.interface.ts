export default interface IReportAll {
  userId: number;
  email: string;
  password: string;
  userRole: number;
  userDateCreated: Date;
  lastLoggedIn: Date;
  reportId: number;
  reportName: string;
  solarScore: number;
  runningTime: number;
  reportDateCreated: Date;
  basicCalculationId: number;
  daylightHours: number;
  location: string;
  basicCalculationDateCreated: Date;
  systemId: number;
  systemSize: number;
  inverterOutput: number;
  numberOfPanels: number;
  batterySize: number;
  numberOfBatteries: number;
  solarInput: number;
  image: string;
  batteryLife: number;
}
