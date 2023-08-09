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


    //create solar score
    public async Task<string> Create(SolarScore ss)
    {
        var client = new HttpClient();
        var request = new HttpRequestMessage(
            HttpMethod.Post,
            express + "/api/solarscore/create/"
        );
        var content = new StringContent(
            "{\r\n    \"solarScoreId\": \""
                + ss.solarScoreId
                + "\",\r\n    \"data\": \""
                + ss.data
                + "\",\r\n    \"remainingCalls\": "
                + ss.remainingCalls
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
            throw new Exception("Error creating solar score");
        }
    }

    //UpdateSolarScore solar score
    public async Task<string> UpdateSolarScore(SolarScore ss)
    {
        var client = new HttpClient();
        var request = new HttpRequestMessage(
            HttpMethod.Patch,
            express + "/api/solarscore/update/" + ss.solarScoreId
        );
        var content = new StringContent(
            "{\r\n  \"data\": \""
                + ss.data
                + "\",\r\n    \"remainingCalls\": "
                + ss.remainingCalls
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
            throw new Exception("Error updating solar score");
        }
    }

    //Delete solar score
    public async Task<string> DeleteSolarScore(string solarScoreId)
    {
        var client = new HttpClient();
        var request = new HttpRequestMessage(
            HttpMethod.Delete,
            express + "/api/solarscore/delete/" + solarScoreId
        );
        var response = await client.SendAsync(request);
        if (response.IsSuccessStatusCode)
        {
            string data = response.Content.ReadAsStringAsync().Result;
            return data;

        }
        else
        {
            throw new Exception("Error deleting solar score");
        }
    }
}


