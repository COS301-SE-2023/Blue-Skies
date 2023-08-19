public class ReportModel
{
    public int reportId { get; set; }
    public string? reportName { get; set; }
    public int userId { get; set; }
    public int systemId { get; set; }
    public double latitude { get; set; }
    public double longitude { get; set; }
    public DateTime dateCreated { get; set; }
}
