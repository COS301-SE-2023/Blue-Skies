using System.Net;
using System.Text.Json;

namespace Api.Repository;

//Create class
public class ReportAllRepository
{
    private string express = "http://localhost:3333";

    public ReportAllRepository()
    {
        var backendexpress = Environment.GetEnvironmentVariable("EXPRESS_BACKEND");
        if (backendexpress != null)
        {
            express = backendexpress;
        }
    }

    public async Task<List<ReportAll>> GetAllReportAll()
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Get, express + "/api/reportAll/all");
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadAsStringAsync();
                var reports = JsonSerializer.Deserialize<List<ReportAll>>(data);
                if (reports != null)
                {
                    Console.WriteLine(".NET: get all reports success");
                    return reports;
                }

                Console.WriteLine(".NET: report is null error");
                return new List<ReportAll>();
            }
            else
            {
                //return empty list
                Console.WriteLine(".NET: Database Connection Error");
                return new List<ReportAll>();
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(".NET: Database Connection Error: " + e.Message);
            throw new Exception("Database Connection Error");
        }
    }

    //get report by reportId
    public async Task<ReportAll> GetReportById(int reportId)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Get,
                express + "/api/reportAll/" + reportId
            );
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadAsStringAsync();
                var reports = JsonSerializer.Deserialize<ReportAll>(data);
                if (reports != null)
                {
                    Console.WriteLine(".NET: get all reports success");
                    return reports;
                }

                Console.WriteLine(".NET: report is null error");
                return new ReportAll();
            }
            else
            {
                //return empty list
                Console.WriteLine(".NET: Database Connection Error");
                return new ReportAll();
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(".NET: Database Connection Error: " + e.Message);
            throw new Exception("Database Connection Error");
        }
    }

    //get report by userId
    public async Task<List<ReportAll>> GetReportByUserId(int userId)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Get,
                express + "/api/reportAll/user/" + userId
            );
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadAsStringAsync();
                var reports = JsonSerializer.Deserialize<List<ReportAll>>(data);
                if (reports != null)
                {
                    Console.WriteLine(".NET: get all reports success");
                    return reports;
                }

                Console.WriteLine(".NET: report is null error");
                return new List<ReportAll>();
            }
            else
            {
                //return empty list
                Console.WriteLine(".NET: Database Connection Error");
                return new List<ReportAll>();
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(".NET: Database Connection Error: " + e.Message);
            throw new Exception("Database Connection Error");
        }
    }
}
