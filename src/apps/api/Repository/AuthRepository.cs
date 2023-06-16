using System.Net;

namespace Api.Repository;

public class AuthRepository
{
  public async Task<bool> checkemail(string email)
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
}

