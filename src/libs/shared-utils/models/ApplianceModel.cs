public class ApplianceModel
{
    public int applianceId { get; set; }
    public string? type { get; set; }
    public int powerUsage { get; set; }
    public bool? recordState { get; set; }
    public int quantity { get; set; } = 0;
    public string? fade { get; set; } = "fade-in-enter-active";
}
