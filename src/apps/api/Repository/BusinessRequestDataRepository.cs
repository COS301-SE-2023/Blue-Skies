using System.Net;
using System;
using System.Text.Json;
using Newtonsoft.Json;
using System.Threading.Tasks.Dataflow;
using System.Collections.Concurrent;

namespace Api.Repository;

public class BusinessRequestDataRepository
{
    private SharedUtils.locationDataClass locationDataClass = new SharedUtils.locationDataClass();
    private SharedUtils.otherDataClass otherDataClass = new SharedUtils.otherDataClass();
    private string express = "http://localhost:3333";
    private string? API_PORT = Environment.GetEnvironmentVariable("API_PORT");
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
        LocationDataModel? currentLocationData = new LocationDataModel();
        try
        {
            var key = requestData.key;
            var data = requestData.data;
            var latitude = requestData.latitude;
            var longitude = requestData.longitude;
            
            //create data if not created yet

            var client = new HttpClient();
            var dataTypeResponse = new HttpResponseMessage();
           
            switch(data!.ToLower()){
                case "solar score" : 
                    LocationDataModel exists = await locationDataClass.GetLocationData(latitude, longitude);
                    if (exists.data == null)
                    {
                        
                        await locationDataClass.GetInitialData(latitude, longitude);
                        byte[] imageBytes = await locationDataClass.DownloadImageFromGoogleMapsService(latitude, longitude);
                        var location = await otherDataClass.GetLocationNameFromCoordinates(latitude, longitude);
                        
                        await locationDataClass.CreateLocationData(latitude, longitude, (float)currentLocationData.daylightHours, Convert.ToBase64String(imageBytes), location);
                    }

                    var dataType = new HttpRequestMessage(
                        HttpMethod.Get, 
                        express + "/api/locationData/withoutImage/{" + longitude.ToString().Replace(",",".") + "}/{" + latitude.ToString().Replace(",",".") + "}"
                    );
                    dataTypeResponse = await client.SendAsync(dataType);

                    break;
                default : 
                    throw new Exception("Error: Not a valid option chosen for data type");
            }
            
           return await dataTypeResponse.Content.ReadAsStringAsync();
           





            // var request = new HttpRequestMessage(
            //     HttpMethod.Post, 
            //     express + "/api/locationData/create"
            // );





            // var content = new StringContent("{\r\n    \"latitude\": " + latitude +",\r\n    \"longitude\": " + longitude + "\"\r\n}", null, "application/json"); 
            // request.Content = content;

          
            // var response = await client.SendAsync(request);
            // if (response.IsSuccessStatusCode)
            // {
            //     return "Solar Irradiation created successfully";
            // }
            // else if (response.StatusCode == HttpStatusCode.BadRequest)
            // {
            //     return "Solar Irradiation already exists";
            // }
            // else
            // {
            //     throw new Exception("Error creating solar irradiation");
            // }
        }
        catch (System.Exception)
        {

            throw new Exception("Could not create solar irradiation");
        }
    }
}