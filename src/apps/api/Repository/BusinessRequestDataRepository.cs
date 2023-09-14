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
    
    // public async Task<string> GetProcessedDataAsync(BusinessRequestData requestData)
    // {
    //     // LocationDataModel? currentLocationData = new LocationDataModel();
    //     // try
    //     // {
    //     //     var key = requestData.key;
    //     //     var data = requestData.data;
    //     //     var latitude = requestData.latitude;
    //     //     var longitude = requestData.longitude;
            
    //     //     //create data if not created yet

    //     //     var client = new HttpClient();
    //     //     var dataTypeResponse = new HttpResponseMessage();
           
    //         LocationDataModel locationData = await locationDataClass.GetLocationData(latitude, longitude);
    //                 if (locationData.data == null)
    //                 {
                        
    //     //                 var initialDataModel = await locationDataClass.GetInitialData(latitude, longitude);
    //     //                 byte[] imageBytes = await locationDataClass.DownloadImageFromGoogleMapsService(latitude, longitude);
    //     //                 var location = await otherDataClass.GetLocationNameFromCoordinates(latitude, longitude);
                       
    //     //                 await locationDataClass.CreateLocationData(latitude, longitude, (float)initialDataModel.averageSunlightHours, Convert.ToBase64String(imageBytes), location);
    //     //             }

    //         switch(data!.ToLower()){
    //             case "solar score" : 
    //                 var content = await GetSolarScore((double)latitude, (double)longitude);
    //                 dataTypeResponse.Content = new StringContent(content);
    //                 break;
    //             case "solar array" : 
    //                 var solarArray = await GetSolarRadiationList((double)latitude, (double)longitude);
    //                 dataTypeResponse.Content = new StringContent(JsonConvert.SerializeObject(solarArray));
    //                 break;
    //             case "average solar irradiation" : 
    //                 var solarIrradiation = await GetAverageSolar((double)latitude, (double)longitude);
    //                 dataTypeResponse.Content = new StringContent(solarIrradiation);
    //                 break;
    //             default : 
    //                 dataTypeResponse.Content = new StringContent("ERROR: Invalid data type");
    //                 break;
    //         }
            
    //     //    return await dataTypeResponse.Content.ReadAsStringAsync();
           
    //     }
    //     catch (System.Exception)
    //     {
    //         throw new Exception("Could not create solar irradiation");
    //     }
    // }

    //  private Task<string> GetAverageSolar(double latitude, double longitude)
    // {
    //     DataHandlers.SolarDataHandler solarCalculator = new DataHandlers.SolarDataHandler();
    //     solarCalculator.reset();
    //     double averageSolarIrradiation=0;

    //     while(solarCalculator.remainingCalls > 0 && solarCalculator.timesNotUpdated < 10) {
    //         averageSolarIrradiation = solarCalculator.GetAverageSolarIrradiation(latitude, longitude);
    //         Console.WriteLine("Remaining calls: " + solarCalculator.remainingCalls + " timesNotUpdated: " + solarCalculator.timesNotUpdated + " averageSolarIrradiation: " + averageSolarIrradiation);
    //         Task.Delay(3000);
    //     }

    //     return Task.FromResult(averageSolarIrradiation.ToString());
    // }

    // private async Task<String> GetSolarScore(double latitude, double longitude) 
    // {
    //     DataHandlers.SolarDataHandler solarCalculator = new DataHandlers.SolarDataHandler();
    //     solarCalculator.reset();
    //     int solarScore=0;
        
    //     while(solarCalculator.remainingCalls > 0 && solarCalculator.timesNotUpdated < 10) {
    //         solarScore = await solarCalculator.GetSolarScoreFromData(latitude, longitude, 0);
    //         Console.WriteLine("Remaining calls: " + solarCalculator.remainingCalls + " timesNotUpdated: " + solarCalculator.timesNotUpdated + " solarScore: " + solarScore);
    //         await Task.Delay(3000);

    //     }
    //     return solarScore.ToString();
    // }

    // private async Task<List<DateRadiationModel>> GetSolarRadiationList(double latitude, double longitude)
    // {   
    //     DataHandlers.SolarDataHandler solarCalculator = new DataHandlers.SolarDataHandler();
    //     solarCalculator.reset();
    //     List<DateRadiationModel> solarRadiationList = new List<DateRadiationModel>();
    //     while(solarCalculator.remainingCalls > 0 && solarCalculator.timesNotUpdated < 10) {
    //         solarRadiationList = await solarCalculator.GetSolarRadiationListFromData(latitude, longitude);
    //         Console.WriteLine("Remaining calls: " + solarCalculator.remainingCalls + " timesNotUpdated: " + solarCalculator.timesNotUpdated + " solarRadiationList: " + solarRadiationList);
    //         await Task.Delay(3000);
    //     }
    //     return solarRadiationList;
    // }
}