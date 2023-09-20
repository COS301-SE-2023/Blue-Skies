export default interface IReportAllAppliance {
    reportId: number;
    applianceId: number;
    numberOfAppliances: number;
    type: string;
    applianceModel: string;
    powerUsage: number;
    durationUsed: number;
    defaultPowerUsage: number;
    defaultDurationUsed: number;
}