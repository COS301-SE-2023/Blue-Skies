using System.Net;
using System.Text.Json;
namespace Api.Repository;


//Create class
public class KeysRepository
{
  //Get all keys
  public async Task<List<Keys>> GetAllKeys()
  {
    try
    {
      var client = new HttpClient();
      var request = new HttpRequestMessage(HttpMethod.Get, "http://localhost:3333/api/key/all");
      var response = await client.SendAsync(request);

      if (response.IsSuccessStatusCode)
      {
        var data = await response.Content.ReadAsStringAsync();
        //Console.WriteLine(data);
        var systems = JsonSerializer.Deserialize<List<Keys>>(data);
        if (systems != null)
        {
          return systems;
        }
        return new List<Keys>();
      }
      else
      {
        //return empty list
        Console.WriteLine("Error");
        return new List<Keys>();
      }

    }
    catch (Exception e)
    {
      throw new Exception("Database Connection Error");
    }

  }
}