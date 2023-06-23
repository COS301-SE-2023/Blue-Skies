using System.Text.Json;
namespace Api.Repository;

//Create class 
public class SystemsRepository
{
  //Create method
  public async Task<List<System>> GetAllSystems()
  {
    try
    {
      var client = new HttpClient();
      var request = new HttpRequestMessage(HttpMethod.Get, "http://localhost:3333/api/system/all");
      var response = await client.SendAsync(request);
      if (response.IsSuccessStatusCode)
      {
        var data = await response.Content.ReadAsStringAsync();
        //Console.WriteLine(data);
        var systems = JsonSerializer.Deserialize<List<System>>(data);
        if (systems != null)
        {
          return systems;
        }
        return new List<System>();
      }
      else
      {
        //return empty list
        Console.WriteLine("Error");
        return new List<System>();
      }


    }
    catch (Exception e)
    {
      throw new Exception("Database Connection Error");
    }
  }
}