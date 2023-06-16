namespace Api;

public class Auth
{

  public string? email { get; set; }
  public string? password { get; set; }
  public string? userRole { get; set; }
  public Auth(string email, string password, string userRole)
  {
    this.email = email;
    this.password = password;
    this.userRole = userRole;
  }
}