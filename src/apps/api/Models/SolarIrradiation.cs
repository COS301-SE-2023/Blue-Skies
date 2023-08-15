public class SolarIrradiation
{

    public double latitude { get; set; }
    public double longitude { get; set; }

    public string location { get; set; }
    public string data { get; set; }
    public DateTime? dateCreated { get; set; }

    public int daylightHours { get; set; }

    public int remainingCalls { get; set; }
}