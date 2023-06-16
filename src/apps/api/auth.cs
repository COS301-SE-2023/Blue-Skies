using System.ComponentModel.DataAnnotations;

namespace Api;

public class Auth
{
  [Required(ErrorMessage = "Email is required")]
  [EmailAddress(ErrorMessage = "Invalid Email Address")]
  public string? email { get; set; }
  [Required(ErrorMessage = "Password is required")]
  [MinLength(8, ErrorMessage = "Password must be at least 8 characters")]
  public string? password { get; set; }
  [Required(ErrorMessage = "Re-enter password is required")]
  public string? repassword { get; set; }
  public Auth(string email, string password, string repassword)
  {
    this.email = email;
    this.password = password;
    this.repassword = repassword;
  }
}