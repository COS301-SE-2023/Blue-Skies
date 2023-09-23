namespace Api;

public class ReportAllAppliance
{
    public int reportId { get; set; }
    public int applianceId { get; set; }
    public int numberOfAppliances { get; set; }
    public string? type { get; set; }
    public string? applianceModel { get; set; }
    public int powerUsage { get; set; }
    // durationUsed
    public float durationUsed { get; set; }
    // defaultPowerUsage
    public int defaultPowerUsage { get; set; }
    // defaultDurationUsed
    public float defaultDurationUsed { get; set; }
}
