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
    private DataHandlers.SolarDataHandler solarDataHandler = new DataHandlers.SolarDataHandler();
    // private DataHandlers.RooftopDataHandler rooftopDataHandler = new DataHandlers.RooftopDataHandler();
    private string locationName = "";

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
            var data = requestData.data;
            double latitude = requestData.latitude;
            double longitude = requestData.longitude;
            
            //create data if not created yet

            var client = new HttpClient();
            var dataTypeResponse = new HttpResponseMessage();
           
            LocationDataModel? locationData = await locationDataClass.GetLocationData(latitude, longitude);
            if (locationData == null)
            {                
                var initialDataModel = await locationDataClass.GetInitialData(latitude, longitude);
                locationName = await otherDataClass.GetLocationNameFromCoordinates(latitude, longitude);
                
                await locationDataClass.CreateLocationData(latitude, longitude, locationName);
            }

            switch(data!.ToLower()){
                case "solar score" : 
                    var content = await GetSolarScore((double)latitude, (double)longitude);
                    dataTypeResponse.Content = new StringContent(content);
                    break;
                case "solar array" : 
                    var solarArray = await GetSolarRadiationList((double)latitude, (double)longitude);
                    dataTypeResponse.Content = new StringContent(JsonConvert.SerializeObject(solarArray));
                    break;
                default : 
                    dataTypeResponse.Content = new StringContent("ERROR: Invalid data type");
                    break;
            }
            
           return await dataTypeResponse.Content.ReadAsStringAsync();
           
        }
        catch (System.Exception)
        {
            throw new Exception("Could not create solar irradiation");
        }
    }


    private async Task<String> GetSolarScore(double latitude, double longitude) 
    {
        DataHandlers.SolarDataHandler solarCalculator = new DataHandlers.SolarDataHandler();
        SharedUtils.locationDataClass locationDataClass = new SharedUtils.locationDataClass();
        
        LocationDataModel? locationData = await locationDataClass.GetLocationData(latitude, longitude);
        if(locationData==null){
            await locationDataClass.CreateLocationData(latitude, longitude, locationName);
        }

                   
        return solarCalculator.getSolarScore(locationData!.solarPanelsData).ToString();
    }

    private async Task<List<DateRadiationModel>> GetSolarRadiationList(double latitude, double longitude)
    {   

        DataHandlers.SolarDataHandler solarCalculator = new DataHandlers.SolarDataHandler();
        SharedUtils.locationDataClass locationDataClass = new SharedUtils.locationDataClass();
        
        LocationDataModel? locationData = await locationDataClass.GetLocationData(latitude, longitude);
        if(locationData==null){
            await locationDataClass.CreateLocationData(latitude, longitude, locationName);
        }

        List<DateRadiationModel> solarRadiationList = solarCalculator.getSolarRadiationList(locationData.solarPanelsData);

       
        return solarRadiationList;
    }
}