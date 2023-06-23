

using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Api;
using System.Net;

namespace Api.BackendTests;

public class AuthTests
{

  private WebApplicationFactory<Program>? webFactory { get; set; }

  private HttpClient? httpClient { get; set; }

  public AuthTests()
  {
    webFactory = new WebApplicationFactory<Program>();
    httpClient = webFactory.CreateDefaultClient();
  }

  [Test]
  public async Task HelloWorld()
  {
    var response = await httpClient.GetAsync("/");
    var result = await response.Content.ReadAsStringAsync();
    Assert.That(result, Is.EqualTo("Hello World"));
  }

  [Test]
  public async Task Register_Passwords()
  {
    string email = "passwordsDoNotMatch@gmail.com";
    string password = "password";
    string repassword = "password2";
    Auth test = new Auth(email, password, repassword);
    var response = httpClient.PostAsync("/auth/register", new StringContent(JsonSerializer.Serialize(test), Encoding.UTF8, "application/json")).Result;
    var result = await response.Content.ReadAsStringAsync();
    Console.WriteLine(result);
    Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
    Assert.That(result, Is.EqualTo("Passwords do not match"));

  }
  [Test]
  public async Task Register_InvalidEmail()
  {
    string email = "invalidEmail";
    string password = "password";
    string repassword = "password";
    Auth test = new Auth(email, password, repassword);
    var response = httpClient.PostAsync("/auth/register", new StringContent(JsonSerializer.Serialize(test), Encoding.UTF8, "application/json")).Result;
    var result = await response.Content.ReadAsStringAsync();
    Console.WriteLine(result);
    Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));

  }

  [Test]
  public async Task Register_EmailExists()
  {
    string email = "jessenaidoo24@gmail.com";
    string password = "password";
    string repassword = "password";
    Auth test = new Auth(email, password, repassword);
    var response = httpClient.PostAsync("/auth/register", new StringContent(JsonSerializer.Serialize(test), Encoding.UTF8, "application/json")).Result;
    var result = await response.Content.ReadAsStringAsync();
    Console.WriteLine(result);
    Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
    Assert.That(result, Is.EqualTo("Email is already registered"));
  }

  [Test]

  public async Task Register_Success()
  {
    //Generate random email
    string email = "jessenaidoo" + new Random().Next(0, 1000000) + "@gmail.com";
    string password = "password";
    string repassword = "password";
    Auth test = new Auth(email, password, repassword);
    var response = httpClient.PostAsync("/auth/register", new StringContent(JsonSerializer.Serialize(test), Encoding.UTF8, "application/json")).Result;
    var result = await response.Content.ReadAsStringAsync();
    Console.WriteLine(result);
    Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
    Assert.That(result, Is.EqualTo("User registered successfully"));

  }

}
public class Auth
{

  public string? email { get; set; }

  public string? password { get; set; }

  public string? repassword { get; set; }
  public Auth(string email, string password, string repassword)
  {
    this.email = email;
    this.password = password;
    this.repassword = repassword;
  }
}