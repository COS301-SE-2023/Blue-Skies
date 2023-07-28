using System.Net;
using System.Text.Json;

namespace Api.Repository;

//Create class
public class BasicCalculationRepository
{
    private string express = "http://localhost:3333";

    public BasicCalculationRepository()
    {
        var backendexpress = Environment.GetEnvironmentVariable("EXPRESS_BACKEND");
        if (backendexpress != null)
        {
            express = backendexpress;
        }
    }

    //Get all keys
    public async Task<List<BasicCalculation>> GetAllBasicCalculations()
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Get,
                express + "/api/basicCalculation/all"
            );
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadAsStringAsync();
                var systems = JsonSerializer.Deserialize<List<BasicCalculation>>(data);
                if (systems != null)
                {
                    Console.WriteLine(".NET: get all basic Calculations system");
                    return systems;
                }

                Console.WriteLine(".NET: basic Calculation is null error");
                return new List<BasicCalculation>();
            }
            else
            {
                //return empty list
                Console.WriteLine(".NET: Database Connection Error");
                return new List<BasicCalculation>();
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(".NET: Database Connection Error: " + e.Message);
            throw new Exception("Database Connection Error");
        }
    }

    //Create a basic calculation
    public async Task<BasicCalculation> CreateBasicCalculation(
        int systemId,
        int daylightHours,
        string location,
        int batteryLife
    )
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Post,
                express + "/api/basicCalculation/create"
            );
            var content = new StringContent(
                "{\r\n        \"systemId\": 2,\r\n        \"dayLightHours\": "
                    + daylightHours
                    + ",\r\n        \"location\": \""
                    + location
                    + "\",\r\n        \"batteryLife\": "
                    + batteryLife
                    + "\r\n}",
                null,
                "application/json"
            );
            // var content = new StringContent(
            //     "{\r\n        \"systemId\": "
            //         + systemId
            //         + ",\r\n        \"dayLightHours\": "
            //         + daylightHours
            //         + ",\r\n        \"location\": \""
            //         + location
            //         + "\",\r\n        \"batteryLife\": "
            //         + batteryLife
            //         + "\r\n}",
            //     null,
            //     "application/json"
            // );
            request.Content = content;
            var response = await client.SendAsync(request);
            // response.EnsureSuccessStatusCode();
            // Console.WriteLine(await response.Content.ReadAsStringAsync());
            if (response.IsSuccessStatusCode)
            {
                BasicCalculation basicCalculation = new BasicCalculation();
                basicCalculation.basicCalculationId = -1;
                basicCalculation.systemId = systemId;
                basicCalculation.daylightHours = daylightHours;
                basicCalculation.location = location;
                basicCalculation.batteryLife = batteryLife;
                basicCalculation.dateCreated = DateTime.Now;
                Console.WriteLine(".NET: Created basic calculation");
                return basicCalculation;
            }
            else
            {
                throw new Exception("Could not create basic calculation");
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(".NET: Database Connection Error: " + e.Message);
            throw new Exception("Database Connection Error");
        }
    }
}
