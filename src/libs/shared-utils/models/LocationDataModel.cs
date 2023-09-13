public class LocationDataModel
{
    public double latitude { get; set; }
    public double longitude { get; set; }
    public string? location { get; set; }
    public byte[]? satteliteImageData { get; set; }
    public byte[]? satteliteElevationImageData { get; set; }
    public byte[]? annualFluxData { get; set; }
    public byte[]? maskData { get; set; }
    public DateTime? dateCreated { get; set; }
    public double daylightHours { get; set; }
    public string? elevationData { get; set; }
}