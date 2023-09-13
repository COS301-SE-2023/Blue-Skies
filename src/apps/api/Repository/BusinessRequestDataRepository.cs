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
        // LocationDataModel? currentLocationData = new LocationDataModel();
        // try
        // {
        //     var key = requestData.key;
        //     var data = requestData.data;
        //     var latitude = requestData.latitude;
        //     var longitude = requestData.longitude;
            
        //     //create data if not created yet

        //     var client = new HttpClient();
        //     var dataTypeResponse = new HttpResponseMessage();
           
        //     LocationDataModel exists = await locationDataClass.GetLocationData(latitude, longitude);
        //             if (exists.data == null)
        //             {
                        
        //                 var initialDataModel = await locationDataClass.GetInitialData(latitude, longitude);
        //                 byte[] imageBytes = await locationDataClass.DownloadImageFromGoogleMapsService(latitude, longitude);
        //                 var location = await otherDataClass.GetLocationNameFromCoordinates(latitude, longitude);
                       
        //                 await locationDataClass.CreateLocationData(latitude, longitude, (float)initialDataModel.averageSunlightHours, Convert.ToBase64String(imageBytes), location);
        //             }

        //     switch(data!.ToLower()){
        //         case "solar score" : 
        //             String content = await solarScore(client, dataTypeResponse,(float) latitude,(float) longitude);
        //             dataTypeResponse.Content = new StringContent(content);
        //             break;
        //         default : 
        //             throw new Exception("Error: Not a valid option chosen for data type");
        //     }
            
        //    return await dataTypeResponse.Content.ReadAsStringAsync();
           
        // }
        // catch (System.Exception)
        // {

        //     throw new Exception("Could not create solar irradiation");
        // }
        return "";
    }

    private async Task<String> solarScore(HttpClient client, HttpResponseMessage dataTypeResponse, float latitude, float longitude){
         var dataType = new HttpRequestMessage(
                        HttpMethod.Get, 
                        API_PORT + "/locationData/getLocationDataWithoutImage/" + latitude.ToString().Replace(",",".") + "/" + longitude.ToString().Replace(",",".") 
                    );
                    Console.WriteLine("CALL: " + API_PORT + "/locationData/getLocationDataWithoutImage/" + longitude.ToString().Replace(",",".") + "/" + latitude.ToString().Replace(",","."));
                    client = new HttpClient();
                    dataTypeResponse = await client.SendAsync(dataType);
                    Console.WriteLine("Response: " + dataTypeResponse);
                    return await dataTypeResponse.Content.ReadAsStringAsync();
    }
    
}