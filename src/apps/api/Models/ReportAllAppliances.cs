namespace Api;

public class ReportAllAppliance
{
    public int reportId { get; set; }
    public int applianceId { get; set; }
    public int numberOfAppliances { get; set; }
    public string? type { get; set; }
    public string? applianceModel { get; set; }
    public int powerUsage { get; set; }
    public float durationUsed { get; set; }
    public int defaultPowerUsage { get; set; }
    public float defaultDurationUsed { get; set; }
}
