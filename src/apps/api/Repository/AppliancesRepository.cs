using System.Net;
using System.Text.Json;

namespace Api.Repository;

//Create class
public class AppliancesRepository
{
    public async Task<List<Appliances>> GetAllAppliances()
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Get,
                "http://localhost:3333/api/appliance/all"
            );
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadAsStringAsync();
                Console.WriteLine(".NET: " + data);
                var systems = JsonSerializer.Deserialize<List<Appliances>>(data);
                if (systems != null)
                {
                    Console.WriteLine(".NET: " + systems);
                    return systems;
                }

                Console.WriteLine(".NET: system is null error");
                return new List<Appliances>();
            }
            else
            {
                //return empty list
                Console.WriteLine(".NET: Database Connection Error");
                return new List<Appliances>();
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(".NET: Database Connection Error:" + e.Message);
            throw new Exception("Database Connection Error:" + e.Message);
        }
    }

    public async Task<Appliances> createAppliances(string type, int powerUsage)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Post,
                "http://localhost:3333/api/appliance/create"
            );
            var content = new StringContent(
                "{\r\n    \"type\" : \""
                    + type
                    + "\",\r\n    \"powerUsage\" : "
                    + powerUsage
                    + "\r\n}",
                null,
                "application/json"
            );
            request.Content = content;
            var response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                Appliances app = new Appliances();
                app.applianceId = -1;
                app.type = type;
                //Convert string to int
                app.powerUsage = powerUsage;
                Console.WriteLine(".NET: " + app);
                return app;
            }
            else
            {
                Console.WriteLine(".NET: Could not create Appliance");
                throw new Exception("Could not create Appliance");
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(".NET: Database Error: " + e.Message);
            throw new Exception("Database Error: " + e.Message);
        }
    }

    public async Task<Appliances> updateAppliances(int id, string type, int powerUsage)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Patch,
                "http://localhost:3333/api/appliance/update/" + id
            );
            var content = new StringContent(
                "{\r\n"
                    + "\"type\" : \""
                    + type
                    + "\",\r\n"
                    + "\"powerUsage\" : "
                    + powerUsage
                    + "\r\n}",
                null,
                "application/json"
            );
            request.Content = content;
            var response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                Appliances app = new Appliances();
                app.applianceId = id;
                app.type = type;
                app.powerUsage = powerUsage;

                Console.WriteLine(".NET: " + app);
                return app;
            }
            else
            {
                Console.WriteLine(".NET: Could not update Appliance");
                throw new Exception("Could not update Appliance");
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(".NET: Database Error: " + e.Message);
            throw new Exception("Database Error: " + e.Message);
        }
    }

    //Delete Appliance
    public async Task<bool> deleteAppliances(int id)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Delete,
                "http://localhost:3333/api/appliance/delete/" + id
            );
            var response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                Console.WriteLine(".NET: " + response);
                return true;
            }
            //Check Status code
            else if (response.StatusCode == HttpStatusCode.NotFound)
            {
                Console.WriteLine(".NET: " + response);
                return false;
            }
            else
            {
                Console.WriteLine(".NET: Could not delete Appliance");
                throw new Exception("Could not delete Appliance");
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(".NET: Database Error: " + e.Message);
            throw new Exception("Database Error: " + e.Message);
        }
    }

    //Get Appliance by id
    public async Task<Appliances> getApplianceById(int id)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Get,
                "http://localhost:3333/api/appliance/" + id
            );
            var response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadAsStringAsync();
                //Console.WriteLine(data);
                var app = JsonSerializer.Deserialize<Appliances>(data);
                if (app != null)
                {
                    Console.WriteLine(".NET: " + app); 
                    return app;
                }

                Console.WriteLine(".NET: Appliance is null error");
                return new Appliances();
            }
            else
            {
                //return empty list
                Console.WriteLine(".NET: Could not get Appliance");
                throw new Exception("Could not get Appliance");
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(".NET: Database Error: " + e.Message);
            throw new Exception("Database Error: " + e.Message);
        }
    }
}
