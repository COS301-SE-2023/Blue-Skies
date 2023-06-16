using System.Net;

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
    catch (System.Exception)
    {
      throw new Exception("Could not check email");
    }
  }

  public async Task<bool> register(string email, string password, string userRole)
  {
    try
    {
      var client = new HttpClient();
      var request = new HttpRequestMessage(HttpMethod.Post, "http://localhost:3333/api/auth/register");
      var content = new StringContent("{\r\n    \"email\" : \"" + email + "\",\r\n    \"password\" : \"" + password + "\",\r\n    \"userRole\" : " + userRole + "\r\n}", null, "application/json");
      request.Content = content;
      var response = await client.SendAsync(request);
      if (response.StatusCode == HttpStatusCode.OK)
      {
        return true;
      }
      return false;
    }
    catch (System.Exception)
    {
      throw new Exception("Could not register user");
    }

  }
}

