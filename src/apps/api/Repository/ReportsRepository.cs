using System.Net;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Api.Repository;

//Create class
public class ReportsRepository
{
    private string express = "http://localhost:3333";

    public ReportsRepository()
    {
        var backendexpress = Environment.GetEnvironmentVariable("EXPRESS_BACKEND");
        if (backendexpress != null)
        {
            express = backendexpress;
        }
    }

    public async Task<List<Reports>> GetAllReports()
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Get, express + "/api/report/all");
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadAsStringAsync();
                var reports = JsonSerializer.Deserialize<List<Reports>>(data);
                if (reports != null)
                {
                    Console.WriteLine(".NET: get all reports success");
                    return reports;
                }

                Console.WriteLine(".NET: report is null error");
                return new List<Reports>();
            }
            else
            {
                //return empty list
                Console.WriteLine(".NET: Database Connection Error in function GetAllReports");
                return new List<Reports>();
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(".NET: Database Connection Error: " + e.Message);
            throw new Exception("Database Connection Error");
        }
    }

    public async Task<List<Reports>> GetUserReports(int userId)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Get,
                express + "/api/report/getUserReports/" + userId
            );
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadAsStringAsync();
                var reports = JsonSerializer.Deserialize<List<Reports>>(data);
                if (reports != null)
                {
                    Console.WriteLine(".NET: get all reports success");
                    return reports;
                }

                Console.WriteLine(".NET: report is null error");
                return new List<Reports>();
            }
            else
            {
                //return empty list
                Console.WriteLine(".NET: Database Connection Error in function GetAllReports");
                return new List<Reports>();
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(".NET: Database Connection Error: " + e.Message);
            throw new Exception("Database Connection Error");
        }
    }

    public async Task<Reports> CreateReports(
        string reportName,
        int userId,
        string homeSize,
        int systemId,
        double latitude,
        double longitude
    )
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Post, express + "/api/report/create");
            var content = new StringContent(
                "{\r\n    \"reportName\" : \""
                    + reportName
                    + "\",\r\n    \"userId\" : "
                    + userId
                    + ",\r\n    \"homeSize\" : \""
                    + homeSize
                    + "\",\r\n    \"systemId\" : "
                    + systemId
                    + ",\r\n    \"latitude\" : \""
                    + latitude.ToString().Replace(",", ".")
                    + "\",\r\n    \"longitude\" : \""
                    + longitude.ToString().Replace(",", ".")
                    + "\"\r\n}",
                null,
                "application/json"
            );
            request.Content = content;
            var response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadAsStringAsync();
                var report = JsonSerializer.Deserialize<Reports>(data);
                Reports rep = new Reports();
                rep.reportId = report!.reportId;
                rep.reportName = reportName;
                rep.userId = userId;
                rep.systemId = systemId;
                rep.latitude = latitude;
                rep.longitude = longitude;
                Console.WriteLine(".NET: report created successfully");
                return rep;
            }
            else
            {
                Console.WriteLine(
                    ".NET: Error creating report: " + await response.Content.ReadAsStringAsync()
                );
                throw new Exception("Error creating report");
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(".NET: Database Error: " + e.Message);
            throw new Exception("Database Error: " + e.Message);
        }
    }

    public async Task<Reports> UpdateReports(
        int reportId,
        string reportName,
        int userId,
        string homeSize,
        int systemId,
        double latitude,
        double longitude
    )
    {
        try
        {
            Console.WriteLine("Updating report from the API");
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Patch,
                express + "/api/report/update/" + reportId
            );
            var content = new StringContent(
                "{\r\n    \"reportName\" : \""
                    + reportName
                    + "\",\r\n    \"userId\" : "
                    + userId
                    + ",\r\n    \"homeSize\" : \""
                    + homeSize
                    + "\",\r\n    \"systemId\" : "
                    + systemId
                    + ",\r\n    \"latitude\" : \""
                    + latitude.ToString().Replace(",", ".")
                    + "\",\r\n    \"longitude\" : \""
                    + longitude.ToString().Replace(",", ".")
                    + "\"\r\n}",
                null,
                "application/json"
            );
            request.Content = content;
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                Reports rep = new Reports();
                rep.reportId = reportId;
                rep.reportName = reportName;
                rep.userId = userId;
                rep.systemId = systemId;
                rep.latitude = latitude;
                rep.longitude = longitude;
                Console.WriteLine(".NET: report updated successfully");
                return rep;
            }
            else
            {
                Console.WriteLine(await response.Content.ReadAsStringAsync());
                Console.WriteLine(".NET: Error updating report");
                throw new Exception("Error updating report");
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(".NET: Database Error: " + e.Message);
            throw new Exception("Database Error: " + e.Message);
        }
    }

    //Delete report
    public async Task<bool> DeleteReports(int reportId)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Delete,
                express + "/api/report/delete/" + reportId
            );
            var response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                Console.WriteLine(".NET: Report deleted");
                return true;
            }
            if (response.StatusCode == HttpStatusCode.NotFound)
            {
                Console.WriteLine(".NET: Report not found");
                return false;
            }
            else
            {
                Console.WriteLine(".NET: Error deleting report");
                throw new Exception("Error deleting report");
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(".NET: Database Error: " + e.Message);
            throw new Exception("Database Error: " + e.Message);
        }
    }

    //get report by id
    public async Task<Reports> GetReportById(int reportId)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Get,
                express + "/api/report/" + reportId
            );
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadAsStringAsync();
                //Console.WriteLine(data);
                var report = JsonSerializer.Deserialize<Reports>(data);
                if (report != null)
                {
                    Console.WriteLine(".NET: report found by id");
                    return report;
                }
                Console.WriteLine(".NET: Report not found");
                return new Reports();
            }
            else
            {
                Console.WriteLine(".NET: Error getting report");
                throw new Exception("Error getting report");
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(".NET: Database Error: " + e.Message);
            throw new Exception("Database Error: " + e.Message);
        }
    }

}
