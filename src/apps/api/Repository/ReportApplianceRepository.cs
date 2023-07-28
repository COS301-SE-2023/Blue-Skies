using System.Net;
using System.Text.Json;

namespace Api.Repository;

//Create class
public class ReportAppliancesRepository
{
    private string express = "http://localhost:3333";

    public ReportAppliancesRepository()
    {
        var backendexpress = Environment.GetEnvironmentVariable("EXPRESS_BACKEND");
        if (backendexpress != null)
        {
            express = backendexpress;
        }
    }

    public async Task<ReportAppliances> CreateReportAppliance(
        int reportId,
        int applianceId,
        int numberOfAppliances
    )
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Post,
                express + "/api/reportAppliance/create"
            );
            var content = new StringContent(
                "{\r\n    \"reportId\" : "
                    + reportId
                    + ",\r\n    \"applianceId\" : "
                    + applianceId
                    + ",\r\n    \"numberOfAppliances\" : "
                    + numberOfAppliances
                    + "\r\n}",
                null,
                "application/json"
            );
            request.Content = content;
            var response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                ReportAppliances rep = new ReportAppliances();
                rep.reportId = reportId;
                rep.applianceId = applianceId;
                rep.numberOfAppliances = numberOfAppliances;

                Console.WriteLine(".NET: report appliance created successfully");
                return rep;
            }
            else
            {
                Console.WriteLine(".NET: Error creating report appliance");
                throw new Exception("Error creating report appliance");
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(".NET: Database Error: " + e.Message);
            throw new Exception("Database Error: " + e.Message);
        }
    }

    public async Task<List<ReportAppliances>> GetAllReportAppliances()
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Get,
                express + "/api/reportAppliance/all"
            );
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadAsStringAsync();
                var reports = JsonSerializer.Deserialize<List<ReportAppliances>>(data);
                if (reports != null)
                {
                    Console.WriteLine(".NET: get all reports success");
                    return reports;
                }

                Console.WriteLine(".NET: report is null error");
                return new List<ReportAppliances>();
            }
            else
            {
                //return empty list
                Console.WriteLine(".NET: Database Connection Error");
                return new List<ReportAppliances>();
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(".NET: Database Connection Error: " + e.Message);
            throw new Exception("Database Connection Error");
        }
    }

    public async Task<List<ReportAppliances>> GetAppliancesInReport(int reportId)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Get,
                express + "/api/reportAppliance/getAppliancesInReport/" + reportId
            );
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadAsStringAsync();
                var reports = JsonSerializer.Deserialize<List<ReportAppliances>>(data);
                if (reports != null)
                {
                    Console.WriteLine(".NET: get all reports success");
                    return reports;
                }

                Console.WriteLine(".NET: report is null error");
                return new List<ReportAppliances>();
            }
            else
            {
                //return empty list
                Console.WriteLine(".NET: Database Connection Error");
                return new List<ReportAppliances>();
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(".NET: Database Connection Error: " + e.Message);
            throw new Exception("Database Connection Error");
        }
    }

    public async Task<List<ReportAppliances>> GetReportsWithAppliance(int applianceId)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Get,
                express + "/api/reportAppliance/getReportsWithAppliance/" + applianceId
            );
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadAsStringAsync();
                var reports = JsonSerializer.Deserialize<List<ReportAppliances>>(data);
                if (reports != null)
                {
                    Console.WriteLine(".NET: get all reports success");
                    return reports;
                }

                Console.WriteLine(".NET: report is null error");
                return new List<ReportAppliances>();
            }
            else
            {
                //return empty list
                Console.WriteLine(".NET: Database Connection Error");
                return new List<ReportAppliances>();
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(".NET: Database Connection Error: " + e.Message);
            throw new Exception("Database Connection Error");
        }
    }

    public async Task<ReportAppliances> GetReportAppliance(int reportId, int applianceId)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Get,
                express + "/api/reportAppliance/" + reportId + "/" + applianceId
            );
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadAsStringAsync();
                //Console.WriteLine(data);
                var report = JsonSerializer.Deserialize<ReportAppliances>(data);
                if (report != null)
                {
                    Console.WriteLine(".NET: report found by id");
                    return report;
                }
                Console.WriteLine(".NET: Report not found");
                return new ReportAppliances();
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

    public async Task<ReportAppliances> UpdateNumberOfAppliances(
        int reportId,
        int applianceId,
        int numberOfAppliances
    )
    {
        try
        {
            Console.WriteLine("Updating number of appliances from the API");
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Patch,
                express
                    + "/api/reportAppliance/updateNumberOfAppliances/"
                    + reportId
                    + "/"
                    + applianceId
            );
            var content = new StringContent(
                "{\r\n    \"numberOfAppliances\" : " + numberOfAppliances + "\r\n}",
                null,
                "application/json"
            );
            request.Content = content;
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                ReportAppliances rep = new ReportAppliances();
                rep.reportId = reportId;
                rep.applianceId = applianceId;
                rep.numberOfAppliances = numberOfAppliances;

                Console.WriteLine(".NET: number of appliances updated successfully");
                return rep;
            }
            else
            {
                Console.WriteLine(await response.Content.ReadAsStringAsync());
                Console.WriteLine(".NET: Error updating number of appliances");
                throw new Exception("Error updating number of appliances");
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(".NET: Database Error: " + e.Message);
            throw new Exception("Database Error: " + e.Message);
        }
    }

    public async Task<ReportAppliances> UpdateReportId(int reportId, int newReportId)
    {
        try
        {
            Console.WriteLine("Updating Report Appliance reportId from the API");
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Patch,
                express + "/api/reportAppliance/updateReportId/" + reportId
            );
            var content = new StringContent(
                "{\r\n    \"newReportId\" : " + newReportId + "\r\n}",
                null,
                "application/json"
            );
            request.Content = content;
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                ReportAppliances rep = new ReportAppliances();
                rep.reportId = newReportId;

                Console.WriteLine(".NET: Report Appliance reportId updated successfully");
                return rep;
            }
            else
            {
                Console.WriteLine(await response.Content.ReadAsStringAsync());
                Console.WriteLine(".NET: Error updating number of appliances");
                throw new Exception("Error updating number of appliances");
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(".NET: Database Error: " + e.Message);
            throw new Exception("Database Error: " + e.Message);
        }
    }

    public async Task<ReportAppliances> UpdateApplianceId(int applianceId, int newApplianceId)
    {
        try
        {
            Console.WriteLine("Updating Report Appliance applianceId from the API");
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Patch,
                express + "/api/reportAppliance/updateApplianceId/" + applianceId
            );
            Console.WriteLine("applianceId : " + applianceId);
            var content = new StringContent(
                "{\r\n    \"newApplianceId\" : " + newApplianceId + "\r\n}",
                null,
                "application/json"
            );
            request.Content = content;
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                ReportAppliances rep = new ReportAppliances();
                rep.reportId = newApplianceId;

                Console.WriteLine(".NET: Report Appliance applianceId updated successfully");
                return rep;
            }
            else
            {
                Console.WriteLine(await response.Content.ReadAsStringAsync());
                Console.WriteLine(".NET: Error updating applianceId");
                throw new Exception("Error updating applianceId");
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(".NET: Database Error: " + e.Message);
            throw new Exception("Database Error: " + e.Message);
        }
    }

    public async Task<bool> DeleteReportId(int reportId)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Delete,
                express + "/api/reportAppliance/deleteReportId/" + reportId
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

    public async Task<bool> DeleteApplianceId(int applianceId)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Delete,
                express + "/api/reportAppliance/deleteApplianceId/" + applianceId
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

    public async Task<bool> DeleteReportAppliance(int reportId, int applianceId)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Delete,
                express + "/api/reportAppliance/delete/" + reportId + "/" + applianceId
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
}
