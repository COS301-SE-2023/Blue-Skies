using System.Net;
using System.Text.Json;

namespace Api.Repository;

//Create class
public class ReportAllApplianceRepository
{
    private string express = "http://localhost:3333";

    public ReportAllApplianceRepository()
    {
        var backendexpress = Environment.GetEnvironmentVariable("EXPRESS_BACKEND");
        if (backendexpress != null)
        {
            express = backendexpress;
        }
    }

    public async Task<List<ReportAllAppliance>> GetAllReportAllAppliance()
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Get,
                express + "/api/reportAllAppliance/all"
            );
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadAsStringAsync();
                var reports = JsonSerializer.Deserialize<List<ReportAllAppliance>>(data);
                if (reports != null)
                {
                    Console.WriteLine(".NET: get all appliances reports success");
                    return reports;
                }

                Console.WriteLine(".NET: report is null error");
                return new List<ReportAllAppliance>();
            }
            else
            {
                //return empty list
                Console.WriteLine(".NET: Database Connection Error");
                return new List<ReportAllAppliance>();
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(".NET: Database Connection Error: " + e.Message);
            throw new Exception("Database Connection Error");
        }
    }

    //get report by reportId
    public async Task<List<ReportAllAppliance>> GetReportAllApplianceById(int reportId)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Get,
                express + "/api/reportAllAppliance/" + reportId
            );
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadAsStringAsync();
                var reports = JsonSerializer.Deserialize<List<ReportAllAppliance>>(data);
                if (reports != null)
                {
                    Console.WriteLine(".NET: get all appliances reports success");
                    return reports;
                }

                Console.WriteLine(".NET: report is null error");
                return new List<ReportAllAppliance>();
            }
            else
            {
                //return empty list
                Console.WriteLine(".NET: Database Connection Error");
                return new List<ReportAllAppliance>();
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(".NET: Database Connection Error: " + e.Message);
            throw new Exception("Database Connection Error");
        }
    }

    //get report by userId
    public async Task<List<ReportAllAppliance>> GetReportByUserId(int userId)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Get,
                express + "/api/reportAllAppliance/user/" + userId
            );
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadAsStringAsync();
                var reports = JsonSerializer.Deserialize<List<ReportAllAppliance>>(data);
                if (reports != null)
                {
                    Console.WriteLine(".NET: get all appliances reports success");
                    return reports;
                }

                Console.WriteLine(".NET: report is null error");
                return new List<ReportAllAppliance>();
            }
            else
            {
                //return empty list
                Console.WriteLine(".NET: Database Connection Error");
                return new List<ReportAllAppliance>();
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(".NET: Database Connection Error: " + e.Message);
            throw new Exception("Database Connection Error");
        }
    }
}
