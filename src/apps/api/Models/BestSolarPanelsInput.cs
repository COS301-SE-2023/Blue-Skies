namespace Api;

public class BestSolarPanelsInput
{
    public string? key { get; set; }
    public int? total_panels { get; set; }
    public double latitude { get; set; }
    public double longitude { get; set; }
}