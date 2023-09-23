namespace Api;

public class BestSolarPanelsOutput
{
    public string? orientation { get; set; }
    public float yearlyEnergyDcKwh { get; set; }
    public double latitude { get; set; }
    public double longitude { get; set; }
}