using System.Net;
using System;
using System.Text.Json;

namespace Api.Repository;

public class BusinessRequestDataRepository
{
    private string express = "http://localhost:3333";
    public BusinessRequestDataRepository()
    {
        var backendexpress = Environment.GetEnvironmentVariable("EXPRESS_BACKEND");
        if (backendexpress != null)
        {
            express = backendexpress;
        }
    }

    public async Task<string> GetProcessedDataAsync(BusinessRequestData requestData)
    {
       try
        {
            var key = requestData.key;
            var data = requestData.data;

            var client = new HttpClient();
            //get and compare key with keys from db
            var keysRequest = new HttpRequestMessage(
                HttpMethod.Get,
                express + "/api/key/all"
            );
            var keysResponse = await client.SendAsync(keysRequest);


            

            var request = new HttpRequestMessage(
                HttpMethod.Post, 
                express + "/api/locationData/create"
            );
            var content = new StringContent("{\r\n    \"latitude\": " + ",\r\n    \"longitude\": " + ",\r\n    \"location\": \"" + "\"\r\n}", null, "application/json"); 
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

  internal Task CreateBusinessRequestData(string v1, string v2)
  {
    throw new NotImplementedException();
  }
}