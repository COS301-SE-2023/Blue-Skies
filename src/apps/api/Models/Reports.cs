namespace Api;

public class Reports
{
    public int reportId { get; set; }
    public string? reportName { get; set; }
    public int userId { get; set; }
    public int basicCalculationId { get; set; }
    public int solarScore { get; set; }
    public int runningTime { get; set; }
    public DateTime dateCreated { get; set; }
}
