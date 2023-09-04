public class WeatherData
{
    public int queryCost { get; set; }
    public double latitude { get; set; }
    public double longitude { get; set; }
    public string? resolvedAddress { get; set; }
    public string? address { get; set; }
    public string? timezone { get; set; }
    public double tzoffset { get; set; }
    public List<WeatherDay>? days { get; set; }
}