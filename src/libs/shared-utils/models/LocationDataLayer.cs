public class LocationDataLayer
{
    public ImageryDate? imageryDate { get; set; }
    public ImageryDate? imageryProcessedDate { get; set; }
    public string? dsmUrl { get; set; }
    public string? rgbUrl { get; set; }
    public string? maskUrl { get; set; }
    public string? annualFluxUrl { get; set; }
    public string? monthlyFluxUrl { get; set; }
    public string? imageryQuality { get; set; }
}