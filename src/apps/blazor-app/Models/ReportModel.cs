public class ReportModel
{

  public int reportId { get; set; }
  //reportName
  public string? reportName { get; set; }
  //userId
  public int userId { get; set; }
  //basicCalculationId
  public int basicCalculationId { get; set; }
  //solarScore
  public int solarScore { get; set; }
  //runningTime
  public int runningTime { get; set; }
  //dateCreated
  public DateTime dateCreated { get; set; }
}