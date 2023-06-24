using System.Text.Json;
namespace Api.Repository;

//Create class 
public class AppliancesRepository
{
  //Create method
  public async Task<List<System>> GetAllAplliances()
  {
    try
    {
      var client = new HttpClient();
      var request = new HttpRequestMessage(HttpMethod.Get, "http://localhost:3333/api/appliance/all");


      if (response.IsSuccessStatusCode)
      {
        var data = await response.Content.ReadAsStringAsync();
        //Console.WriteLine(data);
        var systems = JsonSerializer.Deserialize<List<Appliances>>(data);
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