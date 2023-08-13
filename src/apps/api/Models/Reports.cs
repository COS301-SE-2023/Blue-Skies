namespace Api;

public class Reports
{
    public int reportId { get; set; }
    public string? reportName { get; set; }
    public int userId { get; set; }
    public int systemId { get; set; }
    public int locationId { get; set; }
    public int daylightHours { get; set; }
    public string? image { get; set; }
    public DateTime dateCreated { get; set; }
}
