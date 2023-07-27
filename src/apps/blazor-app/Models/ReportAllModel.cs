public class ReportAllModel
{
    public int userId { get; set; }
    public string? email { get; set; }
    public string? password { get; set; }
    public int userRole { get; set; }
    public DateTime userDateCreated { get; set; }
    public DateTime lastLoggedIn { get; set; }
    public int reportId { get; set; }
    public string? reportName { get; set; }
    public int solarScore { get; set; }
    public int runningTime { get; set; }
    public DateTime reportDateCreated { get; set; }
    public int basicCalculationId { get; set; }
    public float daylightHours { get; set; }
    public string? location { get; set; }
    public DateTime basicCalculationDateCreated { get; set; }
    public int systemId { get; set; }
    public string? systemSize { get; set; }
    public int inverterOutput { get; set; }
    public int numberOfPanels { get; set; }
    public int batterySize { get; set; }
    public int numberOfBatteries { get; set; }
    public int solarInput { get; set; }
    public int applianceId { get; set; }
    public string? type { get; set; }
    public int powerUsage { get; set; }
    public int numberofAppliances { get; set; }
}
