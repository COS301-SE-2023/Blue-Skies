

public class User
{
  public int userId { get; set; }
  public string? email { get; set; }
  public string? password { get; set; }
  public int userRole { get; set; }
  public DateTime? dateCreated { get; set; }
  public DateTime? lastLoggedIn { get; set; }
}