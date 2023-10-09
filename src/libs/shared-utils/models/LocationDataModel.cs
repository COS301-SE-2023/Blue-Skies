public class LocationDataModel
{
    public double latitude { get; set; }
    public double longitude { get; set; }
    public string? locationName { get; set; }
    public RooftopInformationModel? solarPanelsData { get; set; }
    public byte[]? satteliteImageData { get; set; }
    public byte[]? annualFluxData { get; set; }
    public byte[]? monthlyFluxData { get; set; }
    public byte[]? maskData { get; set; }
    public DateTime? dateCreated { get; set; }
    public string? horisonElevationData { get; set; }
}