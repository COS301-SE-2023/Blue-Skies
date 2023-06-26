using System.Net;
using System.Text.Json;

namespace Api.Repository;

//Create class
public class AdminStatsRepository
{
  public async Task<List<SystemUsage>> GetAllSystemUsage()
  {
    try
    {
      //Get All the systems
      var client = new HttpClient();
      var request = new HttpRequestMessage(
          HttpMethod.Get,
          "http://localhost:3333/api/system/all"
      );
      var response = await client.SendAsync(request);
      List<Systems> systems = null;
      if (response.IsSuccessStatusCode)
      {
        var data = await response.Content.ReadAsStringAsync();
        Console.WriteLine("Systems:");
        Console.WriteLine(data);
        systems = JsonSerializer.Deserialize<List<Systems>>(data);
      }

      //Get basic calculations
      var request2 = new HttpRequestMessage(HttpMethod.Get, "http://localhost:3333/api/basicCalculation/all");
      var response2 = await client.SendAsync(request2);
      List<BasicCalculation> basicCalculations = null;
      if (response2.IsSuccessStatusCode)
      {
        var data2 = await response2.Content.ReadAsStringAsync();
        Console.WriteLine("Basic Calculations:");
        Console.WriteLine(data2);
        basicCalculations = JsonSerializer.Deserialize<List<BasicCalculation>>(data2);
      }

      if (systems == null || basicCalculations == null)
      {
        throw new Exception("Database Connection Error");
      }

      //Calculate system usage
      List<SystemUsage> systemUsages = new List<SystemUsage>();
      foreach (Systems system in systems)
      {
        if (systemUsages.FindIndex(x => x.type == system.systemSize) == -1)
        {
          systemUsages.Add(new SystemUsage { type = system.systemSize, count = 0, systemId = system.systemId });
        }
      }
      foreach (BasicCalculation item in basicCalculations)
      {
        int index = systemUsages.FindIndex(x => x.systemId == item.systemId);
        if (index != -1)
        {
          systemUsages[index].count++;
        }
      }
      return systemUsages;

    }
    catch (Exception e)
    {
      throw new Exception("Database Connection Error");
    }

  }
}


