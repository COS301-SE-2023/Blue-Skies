using System.ComponentModel.DataAnnotations;

public class RegisterModel
{
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email address")]
    public string? email { get; set; }

    [Required(ErrorMessage = "Password is required")]
    [MinLength(8, ErrorMessage = "Password must be at least 8 characters")]
    [DataType(DataType.Password)]
    public string? password { get; set; }

    [Compare(nameof(password), ErrorMessage = "Passwords do not match")]
    [DataType(DataType.Password)]
    public string? repassword { get; set; }
}
