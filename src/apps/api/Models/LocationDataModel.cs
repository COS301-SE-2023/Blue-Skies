public class LocationDataModel
{
    public double latitude { get; set; }
    public double longitude { get; set; }
    public string? location { get; set; }
    public string? data { get; set; }
    public DateTime? dateCreated { get; set; }
    public double daylightHours { get; set; }
    public string? image { get; set; }
    public int remainingCalls { get; set; }

    public string? elevationData { get; set; }
}