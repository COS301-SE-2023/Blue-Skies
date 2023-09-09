using System.Net;
using System.Text.Json;

namespace Api.Repository;

public class CustomApplianceRepository
{
    private string express = "http://localhost:3333";

    // Constructor

    public CustomApplianceRepository()
    {
        var backendexpress = Environment.GetEnvironmentVariable("EXPRESS_BACKEND");
        if (backendexpress != null)
        {
            express = backendexpress;
        }
    }

    // Get All Custom Appliances
    public async Task<List<CustomAppliance>> GetAllCustomAppliances()
    {
        //$"{express}/api/customAppliances/all"
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Get, $"{express}/api/customAppliance/all");
        var response = await client.SendAsync(request);
        if (response.StatusCode == HttpStatusCode.OK)
        {
            var body = await response.Content.ReadAsStringAsync();
            var customAppliances = JsonSerializer.Deserialize<List<CustomAppliance>>(body);
            return customAppliances;
        }
        //Bad Request
        else if (response.StatusCode == HttpStatusCode.BadRequest)
        {
            return null;
        }
        else
        {
            throw new Exception("Unable to retrieve custom appliances");
        }
    }

}