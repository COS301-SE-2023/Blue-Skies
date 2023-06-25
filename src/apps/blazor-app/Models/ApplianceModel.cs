using System.ComponentModel.DataAnnotations;

public class ApplianceModel
{
    public int applianceId { get; set; }
    public string? type { get; set; }
    public int powerUsage { get; set; }
}
