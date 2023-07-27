namespace Api;

public class ReportAllAppliance
{
    public int applianceId { get; set; }
    public int reportId { get; set; }
    public int numberOfAppliances { get; set; }
    public string? type { get; set;}
    public int powerUsage { get; set; }
}
