using System.Net;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Security.Cryptography;
namespace Api.Repository;

public class AuthRepository
{
  public async Task<bool> checkemail(string email)
  {
    try
    {
      var client = new HttpClient();
      var request = new HttpRequestMessage(HttpMethod.Get, "http://localhost:3333/api/auth/checkemail");
      var content = new StringContent("{\r\n    \"email\" : \"" + email + "\"\r\n}", null, "application/json");
      request.Content = content;
      var response = await client.SendAsync(request);
      if (response.StatusCode == HttpStatusCode.OK)
      {
        return true;
      }
      return false;
    }
    catch (Exception)
    {
      throw new Exception("Could not check email");
    }
  }

  public async Task<bool> register(string email, string password)
  {
    try
    {

      //Hash password
      int test = 123456789;
      //Convert test to byte array
      byte[] salt = BitConverter.GetBytes(test);
      string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
      password: password!,
      salt: salt,
      prf: KeyDerivationPrf.HMACSHA256,
      iterationCount: 100000,
      numBytesRequested: 256 / 8));
      var client = new HttpClient();
      var request = new HttpRequestMessage(HttpMethod.Post, "http://localhost:3333/api/auth/register");
      var content = new StringContent("{\r\n    \"email\" : \"" + email + "\",\r\n    \"password\" : \"" + hashed + "\",\r\n    \"userRole\" : 0\r\n}", null, "application/json");
      request.Content = content;
      var response = await client.SendAsync(request);
      if (response.StatusCode == HttpStatusCode.OK)
      {
        return true;
      }
      return false;
    }
    catch (Exception)
    {
      throw new Exception("Could not register user");
    }

  }
}

