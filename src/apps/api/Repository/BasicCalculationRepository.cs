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
                Console.WriteLine(
                    ".NET: Database Connection Error in function GetAllBasicCalculations"
                );
                return new List<BasicCalculation>();
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(".NET: Database Connection Error: " + e.Message);
            throw new Exception("Database Connection Error");
        }
    }

    public async Task<BasicCalculation> GetBasicCalculation(int id)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Get,
                express + "/api/basicCalculation/" + id
            );
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadAsStringAsync();
                //Console.WriteLine(data);
                var basicCalculation = JsonSerializer.Deserialize<BasicCalculation>(data);
                if (basicCalculation != null)
                {
                    Console.WriteLine(".NET: basicCalculation found by id");
                    return basicCalculation;
                }
                Console.WriteLine(".NET: basicCalculation not found");
                return new BasicCalculation();
            }
            else
            {
                Console.WriteLine(".NET: Error getting basicCalculation");
                throw new Exception("Error getting basicCalculation");
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(".NET: Database Error: " + e.Message);
            throw new Exception("Database Error: " + e.Message);
        }
    }

    //Create a basic calculation
    public async Task<BasicCalculation> CreateBasicCalculation(
        int systemId,
        string daylightHours,
        string location,
        int batteryLife,
        string image
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
                "{\r\n        \"systemId\": "
                    + systemId
                    + ",\r\n        \"dayLightHours\": \""
                    + daylightHours
                    + "\",\r\n        \"location\": \""
                    + location
                    + "\",\r\n        \"batteryLife\": "
                    + batteryLife
                    + ",\r\n        \"image\": \""
                    + image
                    + "\"\r\n}",
                null,
                "application/json"
            );
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
                basicCalculation.image = image;
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

    public async Task<BasicCalculation> UpdateBasicCalculation(
        int basicCalculationId,
        int systemId,
        string daylightHours,
        string location,
        int batteryLife,
        string image
    )
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Patch,
                express + "/api/basicCalculation/update/" + basicCalculationId
            );
            var content = new StringContent(
                "{\r\n        \"systemId\": "
                    + systemId
                    + ",\r\n        \"dayLightHours\": \""
                    + daylightHours
                    + "\",\r\n        \"location\": \""
                    + location
                    + "\",\r\n        \"batteryLife\": "
                    + batteryLife
                    + ",\r\n        \"image\": \""
                    + image
                    + "\"\r\n}",
                null,
                "application/json"
            );
            request.Content = content;
            var response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                BasicCalculation basicCalculation = new BasicCalculation();
                basicCalculation.basicCalculationId = -1;
                basicCalculation.systemId = systemId;
                basicCalculation.daylightHours = daylightHours;
                basicCalculation.location = location;
                basicCalculation.batteryLife = batteryLife;
                basicCalculation.dateCreated = DateTime.Now;
                basicCalculation.image = image;
                Console.WriteLine(".NET: Updated basic calculation");
                return basicCalculation;
            }
            else
            {
                Console.WriteLine(".NET: Basic Calculation key not updated");
                throw new Exception("Could not update Basic Calculation");
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(".NET: Database Connection Error: " + e.Message);
            throw new Exception("Database Error: " + e.Message);
        }
    }

    //get basic Calculation by record
    public async Task<BasicCalculation> GetCreatedBasicCaluculation(
        int systemId,
        string dayLightHours,
        string location
    )
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Get,
                express + "/api/basicCalculation/getCreated"
            );
            var content = new StringContent(
                "{\r\n        \"systemId\": "
                    + systemId
                    + ",\r\n        \"dayLightHours\": \""
                    + dayLightHours
                    + "\",\r\n        \"location\": \""
                    + location
                    + "\"\r\n}",
                null,
                "application/json"
            );
            request.Content = content;
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadAsStringAsync();
                var basicCalculation = JsonSerializer.Deserialize<BasicCalculation>(data);
                if (basicCalculation != null)
                {
                    Console.WriteLine(".NET: Basic Calculation found by record");
                    return basicCalculation;
                }
                Console.WriteLine(".NET: Basic Calculation not found");
                return new BasicCalculation();
            }
            else
            {
                Console.WriteLine(".NET: Error getting Basic Calculation");
                throw new Exception("Error getting Basic Calculation");
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(".NET: Database Error: " + e.Message);
            throw new Exception("Database Error: " + e.Message);
        }
    }
}
