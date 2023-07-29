using System.Net;
using System.Text.Json;

namespace Api.Repository;

//Create class
public class AdminStatsRepository
{
    private string express = "http://localhost:3333";

    public AdminStatsRepository()
    {
        var backendexpress = Environment.GetEnvironmentVariable("EXPRESS_BACKEND");
        if (backendexpress != null)
        {
            express = backendexpress;
        }
    }

    public async Task<List<SystemUsage>> GetAllSystemUsage()
    {
        try
        {
            //Get All the systems
            var client = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Get, express + "/api/system/all");
            var response = await client.SendAsync(request);
            List<Systems> systems = new List<Systems>();
            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadAsStringAsync();
                Console.WriteLine(".NET: Get All Systems data");
                systems = JsonSerializer.Deserialize<List<Systems>>(data)!;
            }

            //Get basic calculations
            var request2 = new HttpRequestMessage(
                HttpMethod.Get,
                express + "/api/basicCalculation/all"
            );
            var response2 = await client.SendAsync(request2);
            List<BasicCalculation> basicCalculations = new List<BasicCalculation>();
            if (response2.IsSuccessStatusCode)
            {
                var data2 = await response2.Content.ReadAsStringAsync();
                Console.WriteLine(".NET: Get All Basic Calculations");
                basicCalculations = JsonSerializer.Deserialize<List<BasicCalculation>>(data2)!;
            }

            if (systems == null || basicCalculations == null)
            {
                Console.WriteLine(".NET: Database Connection Error");
                throw new Exception("Database Connection Error");
            }

            //Calculate system usage
            List<SystemUsage> systemUsages = new List<SystemUsage>();
            foreach (Systems system in systems)
            {
                if (systemUsages.FindIndex(x => x.type == system.systemSize) == -1)
                {
                    Console.WriteLine(".NET: system of size '" + system.systemSize + "' not found");
                    systemUsages.Add(
                        new SystemUsage
                        {
                            type = system.systemSize,
                            count = 0,
                            systemId = system.systemId
                        }
                    );
                }
            }
            foreach (BasicCalculation item in basicCalculations)
            {
                int index = systemUsages.FindIndex(x => x.systemId == item.systemId);
                if (index != -1)
                {
                    Console.WriteLine(
                        ".NET: system of size '" + systemUsages[index].type + "' found"
                    );
                    systemUsages[index].count++;
                }
            }
            return systemUsages;
        }
        catch (Exception e)
        {
            Console.WriteLine(".NET: " + e.Message);
            throw new Exception("Database Connection Error");
        }
    }
}
