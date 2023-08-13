using System.Net;
using System.Text.Json;

namespace Api.Repository;

//Create class
public class LocationsRepository
{
    private string express = "http://localhost:3333";

    public LocationsRepository()
    {
        var backendexpress = Environment.GetEnvironmentVariable("EXPRESS_BACKEND");
        if (backendexpress != null)
        {
            express = backendexpress;
        }
    }

    //Get all locations
    public async Task<List<Locations>> GetAllLocations()
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Get, express + "/api/location/all");
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadAsStringAsync();
                var systems = JsonSerializer.Deserialize<List<Locations>>(data);
                if (systems != null)
                {
                    Console.WriteLine(".NET: get all locations system");
                    return systems;
                }

                Console.WriteLine(".NET: system is null error");
                return new List<Locations>();
            }
            else
            {
                //return empty list
                Console.WriteLine(".NET: Database Connection Error in function GetAllLocations");
                return new List<Locations>();
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(".NET: Database Connection Error: " + e.Message);
            throw new Exception("Database Connection Error");
        }
    }

    public async Task<Locations> GetLocation(int locationId)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Get,
                express + "/api/location/" + locationId
            );
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadAsStringAsync();
                var loc = JsonSerializer.Deserialize<Locations>(data);
                if (loc != null)
                {
                    Console.WriteLine(".NET: get all locations system");
                    return loc;
                }
                Console.WriteLine(".NET: system is null error");
                return new Locations();
            }
            else
            {
                //return empty list
                Console.WriteLine(".NET: Database Connection Error in function GetLocation");
                return new Locations();
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(".NET: Database Connection Error: " + e.Message);
            throw new Exception("Database Connection Error");
        }
    }

    //Create location
    public async Task<Locations> CreateLocation(string location, float latitude, float longitude)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Post, express + "/api/location/create");
            var content = new StringContent(
                "{\r\n    \"location\": \""
                    + location
                    + "\",\r\n    \"latitude\" : \""
                    + latitude
                    + "\",\r\n    \"longitude\" : \""
                    + longitude
                    + "\"\r\n}",
                null,
                "application/json"
            );
            request.Content = content;
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                Locations ans = new Locations();
                ans.location = location;
                ans.latitude = latitude;
                ans.longitude = longitude;

                Console.WriteLine(".NET: api location created");
                return ans;
            }
            else
            {
                //return empty list
                Console.WriteLine(".NET: API location not created. Database Connection Error");
                return new Locations();
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(
                ".NET: API location not created. Database Connection Error: " + e.Message
            );
            throw new Exception("Database Connection Error");
        }
    }

    public async Task<bool> DeleteLocations(int id)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Delete,
                express + "/api/location/delete/" + id
            );
            var response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                Console.WriteLine(".NET: API location deleted");
                return true;
            }
            //Check Status code
            else if (response.StatusCode == HttpStatusCode.NotFound)
            {
                Console.WriteLine(".NET: API location not found");
                return false;
            }
            else
            {
                Console.WriteLine(".NET: " + response.StatusCode);
                throw new Exception("Could not delete Location");
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(".NET: Database Connection Error: " + e.Message);
            throw new Exception("Database Error: " + e.Message);
        }
    }

    public async Task<Locations> UpdateLocations(
        int locationId,
        string location,
        float latitude,
        float longitude
    )
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Patch,
                express + "/api/location/update/" + locationId
            );
            var content = new StringContent(
                "{\r\n    \"location\": \""
                    + location
                    + "\",\r\n    \"latitude\" : \""
                    + latitude
                    + "\",\r\n    \"longitude\" : \""
                    + longitude
                    + "\"\r\n}",
                null,
                "application/json"
            );
            request.Content = content;
            var response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                Locations loc = new Locations();
                loc.locationId = locationId;
                loc.location = location;
                loc.latitude = latitude;
                loc.longitude = longitude;

                Console.WriteLine(".NET: API location updated");
                return loc;
            }
            else
            {
                Console.WriteLine(".NET: API location not updated");
                throw new Exception("Could not update Location");
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(".NET: Database Connection Error: " + e.Message);
            throw new Exception("Database Error: " + e.Message);
        }
    }
}
