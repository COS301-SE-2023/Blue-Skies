using System.Net;
using System.Text.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using Microsoft.ML;
using static Microsoft.ML.DataOperationsCatalog;
using Microsoft.ML.Vision;
using Microsoft.ML.Data;
using Microsoft.Extensions.ML;

namespace Api.Repository;

public class SolarScoreRepository
{
    private readonly string express = "http://localhost:3333";

    public SolarScoreRepository()
    {
        var backendexpress = Environment.GetEnvironmentVariable("EXPRESS_BACKEND");
        if (backendexpress != null)
        {
            express = backendexpress;
        }
    }

    public async Task<string> GetMapBoxApiKey()
    {
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Get, express + "/api/solarscore/mapboxkey");
        var response = await client.SendAsync(request);
        // response.EnsureSuccessStatusCode();
        // Console.WriteLine(await response.Content.ReadAsStringAsync());
        if (response.IsSuccessStatusCode)
        {
            return await response.Content.ReadAsStringAsync();
        }
        else
        {
            throw new Exception("Error getting mapbox key");
        }
    }
    public async Task<string> GetGoogleMapsKey()
    {
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Get, express + "/api/solarscore/googlemapskey");
        var response = await client.SendAsync(request);
        // response.EnsureSuccessStatusCode();
        // Console.WriteLine(await response.Content.ReadAsStringAsync());
        if (response.IsSuccessStatusCode)
        {
            return await response.Content.ReadAsStringAsync();
        }
        else
        {
            throw new Exception("Error getting google maps key");
        }
    }

    //Get sun times
    public async Task<string> GetSunTimes(Coordinates coordinates)
    {
        var client = new HttpClient();
        var request = new HttpRequestMessage(
            HttpMethod.Get,
            express + "/api/solarscore/getsuntimes/"
        );
        var content = new StringContent(
            "{\r\n    \"latitude\": "
                + coordinates.latitude
                + ",\r\n    \"longitude\": "
                + coordinates.longitude
                + "\r\n}",
            null,
            "application/json"
        );
        request.Content = content;
        var response = await client.SendAsync(request);
        if (response.IsSuccessStatusCode)
        {
            string data = response.Content.ReadAsStringAsync().Result;
            return data;

        }
        else
        {
            throw new Exception("Error getting sun times");
        }
    }


    //Create Solar Irradiation
    public async Task<string> CreateSolarIrradiation(double latitude, double longitude)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Post, express + "/api/solarscore/create");
            var content = new StringContent("{\r\n    \"latitude\": " + latitude + ",\r\n    \"longitude\": " + longitude + "\r\n}", null, "application/json");
            request.Content = content;
            var response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                return "Solar Irradiation created successfully";
            }
            else if (response.StatusCode == HttpStatusCode.BadRequest)
            {
                return "Solar Irradiation already exists";
            }
            else
            {
                throw new Exception("Error creating solar irradiation");
            }
        }
        catch (System.Exception)
        {

            throw new Exception("Could not create solar irradiation");
        }
    }

    //Get solar irradiation
    public async Task<SolarIrradiation> GetSolarIrradiation(double latitude, double longitude)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Get, express + "/api/solarscore/" + latitude + "/" + longitude);
            var response = await client.SendAsync(request);


            if (response.IsSuccessStatusCode)
            {
                string data = response.Content.ReadAsStringAsync().Result;
                SolarIrradiation solarIrradiation = JsonSerializer.Deserialize<SolarIrradiation>(data);
                return solarIrradiation;
            }
            if (response.StatusCode == HttpStatusCode.NotFound)
            {
                return null;
            }
            else
            {
                throw new Exception("Error getting solar irradiation");
            }
        }
        catch (System.Exception)
        {

            throw new Exception("Could not get solar irradiation");
        }
    }

    //UpdateSolarIrradiation
    public async Task<string> UpdateSolarIrradiation(double latitude, double longitude, string data, int remainingCalls)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Patch, express + "/api/solarscore/update/" + latitude + "/" + longitude);
            var content = new StringContent("{\r\n    \"data\": \"" + data + "\",\r\n    \"remainingCalls\": " + remainingCalls + "\r\n}", null, "application/json");
            request.Content = content;
            var response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                return "Solar Irradiation updated successfully";
            }
            else if (response.StatusCode == HttpStatusCode.NotFound)
            {
                return "Solar Irradiation not found";
            }
            else
            {
                throw new Exception("Error updating solar irradiation");
            }
        }
        catch (System.Exception)
        {

            throw new Exception("Could not update solar irradiation");
        }
    }

    //Get Solar Irradiation Data
    public async Task<string> GetSolarIrradiationData(double latitude, double longitude, int numYears, int numDaysPerYear)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Get, "http://localhost:3333/api/solarscore/solarIrradiationData");
            var content = new StringContent("{\r\n    \"latitude\": " + latitude + ",\r\n    \"longitude\": " + longitude + ",\r\n    \"numYears\": " + numYears + ",\r\n    \"numDaysPerYear\": " + numDaysPerYear + "\r\n}", null, "application/json");
            request.Content = content;
            var response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                string data = response.Content.ReadAsStringAsync().Result;
                return data;
            }
            else
            {
                throw new Exception("Error getting solar irradiation data");
            }
        }
        catch (System.Exception)
        {

            throw new Exception("Could not get solar irradiation data");
        }
    }
}


