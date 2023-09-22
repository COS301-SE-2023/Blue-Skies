using Newtonsoft.Json;

namespace Api.Repository;

public class BusinessRequestDataRepository
{
    private struct DataType {
        public const string SOLAR_SCORE = "solar score";
        public const string SOLAR_ARRAY = "solar array";
        public const string SATELLITE_IMAGE = "satellite image";
        public const string ELEVATION = "elevation";
        public const string ADDRESS = "address";
        public const string SUNLIGHT_HOURS = "sunlight hours";
    }

    private SharedUtils.locationDataClass locationDataClass = new SharedUtils.locationDataClass();
    private DataHandlers.SolarDataHandler solarCalculator = new DataHandlers.SolarDataHandler();
    private DataHandlers.RooftopDataHandler rooftopDataHandler = new DataHandlers.RooftopDataHandler();
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
        string typeOfData = "Solar Irradiance";
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
            locationName = await otherDataClass.GetLocationNameFromCoordinates(latitude, longitude);
            if (locationData == null)
            {                
                await locationDataClass.CreateLocationData(latitude, longitude, locationName);
            }
            typeOfData = data!;
            switch(data!.ToLower()){
                case DataType.SOLAR_SCORE : 
                    var content = await GetSolarScore(latitude, longitude);
                    dataTypeResponse.Content = new StringContent(content);
                    break;
                case DataType.SOLAR_ARRAY : 
                    var solarArray = await GetSolarRadiationList(latitude, longitude);
                    dataTypeResponse.Content = new StringContent(JsonConvert.SerializeObject(solarArray));
                    break;
                case DataType.SATELLITE_IMAGE : 
                    var satelliteImage = await GetSatelliteImage(latitude, longitude);
                    dataTypeResponse.Content = new StringContent(satelliteImage);
                    break;
                case DataType.ELEVATION :
                    var elevation = await locationDataClass.GetHorisonElevationData(latitude, longitude);
                    dataTypeResponse.Content = new StringContent(elevation!);
                    break;
                case DataType.ADDRESS :
                    var address = getAddress();
                    dataTypeResponse.Content = new StringContent(address);
                    break;
                case DataType.SUNLIGHT_HOURS :
                    var sunlightHours = GetSunlightHours(latitude, longitude);
                    dataTypeResponse.Content = new StringContent(sunlightHours.ToString());
                    break;
                default : 
                    dataTypeResponse.Content = new StringContent("ERROR: Invalid data type");
                    break;
            }
            
           return await dataTypeResponse.Content.ReadAsStringAsync();
           
        }
        catch (System.Exception)
        {
            throw new Exception("Could not create " + typeOfData!.ToLower() + ". NOTE that a valid address should be used.");
        }
    }

    private double GetSunlightHours(double latitude, double longitude)
    {
        LocationDataModel locationData = GetLocationDataModel(latitude, longitude).Result;

        return solarDataHandler.getSunlightHours(locationData!.solarPanelsData!);
    }

    private async Task<string> GetSatelliteImage(double latitude, double longitude)
    {
        LocationDataModel locationData =await  GetLocationDataModel(latitude, longitude);

        return rooftopDataHandler.GetSatelliteImage(locationData!.satteliteImageData!)!;
    }

    private async Task<string> GetSolarScore(double latitude, double longitude) 
    {
        LocationDataModel locationData = await GetLocationDataModel(latitude, longitude);
                   
        return solarCalculator.getSolarScore(locationData!.solarPanelsData).ToString();
    }

    private async Task<List<DateRadiationModel>> GetSolarRadiationList(double latitude, double longitude)
    {   
        
        LocationDataModel locationDataModel = await GetLocationDataModel(latitude, longitude);
       
        return solarCalculator.getSolarRadiationList(locationDataModel);
    }

    private string getAddress(){
        return locationName;
    }

    private async Task<LocationDataModel> GetLocationDataModel(double latitude, double longitude)
    {
        LocationDataModel? locationData = await locationDataClass.GetLocationData(latitude, longitude);
        if(locationData==null){
            locationData = await locationDataClass.CreateLocationData(latitude, longitude, locationName);
        }
        return locationData!;
    }

    

}