using Newtonsoft.Json;
using System.Text.Json;
using System.Net.Http.Json;
using System.Net;

namespace Api.Repository;

public class BusinessRequestDataRepository
{
    private struct DataType {
        public const string SOLAR_SCORE = "solar score";
        public const string SOLAR_ARRAY = "solar array";
        public const string SATELLITE_IMAGE = "satellite image";
        public const string ADDRESS = "address";
        public const string SUNLIGHT_HOURS = "sunlight hours";
    }

    private string? mapboxAccessToken = Environment.GetEnvironmentVariable("MAP_BOX_API_KEY");
    private DataHandlers.SolarDataHandler solarCalculator = new DataHandlers.SolarDataHandler();
    private DataHandlers.RooftopDataHandler rooftopDataHandler = new DataHandlers.RooftopDataHandler();
    private DataHandlers.SolarDataHandler solarDataHandler = new DataHandlers.SolarDataHandler();
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

            var client = new HttpClient();
            var dataTypeResponse = new HttpResponseMessage();

            LocationDataModel? locationData = await GetLocationData(latitude, longitude);
            locationName = await GetLocationNameFromCoordinates(latitude, longitude);
            if (locationData == null)
            {                
                await CreateLocationData(latitude, longitude, locationName);
            }
            
            typeOfData = data!;
            switch(data!.ToLower()){
                case DataType.SOLAR_SCORE : 
                    var solarScore = await GetSolarScore(latitude, longitude);
                    dataTypeResponse.Content = new StringContent(JsonConvert.SerializeObject(solarScore));
                    break;
                case DataType.SOLAR_ARRAY : 
                    var solarArray = await GetSolarRadiationList(latitude, longitude);
                    dataTypeResponse.Content = new StringContent(JsonConvert.SerializeObject(solarArray));
                    break;
                case DataType.SATELLITE_IMAGE : 
                    var satelliteImage = await GetSatelliteImage(latitude, longitude);
                    dataTypeResponse.Content = new StringContent(JsonConvert.SerializeObject(satelliteImage));
                    break;
                case DataType.ADDRESS :
                    var address = getAddress();
                    dataTypeResponse.Content = new StringContent(JsonConvert.SerializeObject(address));
                    break;
                case DataType.SUNLIGHT_HOURS :
                    var sunlightHours = GetSunlightHours(latitude, longitude);
                    dataTypeResponse.Content = new StringContent(JsonConvert.SerializeObject(sunlightHours));
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

    private SunlightHours GetSunlightHours(double latitude, double longitude)
    {
        LocationDataModel locationData = GetLocationDataModel(latitude, longitude).Result;
        SunlightHours sunlightHours = new SunlightHours();
        sunlightHours.sunlight_hours = solarDataHandler.getSunlightHours(locationData!.solarPanelsData!);
        return sunlightHours;
    }

    private async Task<Base64Image> GetSatelliteImage(double latitude, double longitude)
    {
        LocationDataModel locationData =await  GetLocationDataModel(latitude, longitude);
        Base64Image base64Image = new Base64Image();
        base64Image.base64_image = rooftopDataHandler.GetSatelliteImage(locationData!.satteliteImageData!)!;
        return base64Image!;
    }

    private async Task<SolarScore> GetSolarScore(double latitude, double longitude) 
    {
        LocationDataModel locationData = await GetLocationDataModel(latitude, longitude);
        SolarScore solarScore = new SolarScore();
        solarScore.solar_score = solarCalculator.getSolarScore(locationData!.solarPanelsData);  
        return solarScore;
    }

    private async Task<List<DateRadiationModel>> GetSolarRadiationList(double latitude, double longitude)
    {   
        
        LocationDataModel locationDataModel = await GetLocationDataModel(latitude, longitude);
       
        return solarCalculator.getSolarRadiationList(locationDataModel);
    }

    private Address getAddress(){
        Address address = new Address();
        address.address = locationName;
        return address;
    }

    private async Task<LocationDataModel> GetLocationDataModel(double latitude, double longitude)
    {
        LocationDataModel? locationData = await GetLocationData(latitude, longitude);
        if(locationData==null){
            await CreateLocationData(latitude, longitude, locationName);
            locationData = await GetLocationData(latitude, longitude);
        }
        return locationData!;
    }

    public async Task<LocationDataModel> GetLocationData(double latitude, double longitude)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Get,
                express + "/api/locationData/" + latitude + "/" + longitude
            );
            Console.WriteLine("Getting LocationData for " + latitude + ", " + longitude);
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                string data = response.Content.ReadAsStringAsync().Result;
                LocationDataModelTemp locationDataTemp = System.Text.Json.JsonSerializer.Deserialize<LocationDataModelTemp>(data)!;
                LocationDataModel locationData = new LocationDataModel()
                {
                    latitude = locationDataTemp.latitude,
                    longitude = locationDataTemp.longitude,
                    locationName = locationDataTemp.locationName,
                    solarPanelsData = System.Text.Json.JsonSerializer.Deserialize<RooftopInformationModel>(locationDataTemp.solarPanelsData!),
                    satteliteImageData = Convert.FromBase64String(locationDataTemp.satteliteImageData!),
                    annualFluxData = Convert.FromBase64String(locationDataTemp.annualFluxData!),
                    monthlyFluxData = Convert.FromBase64String(locationDataTemp.monthlyFluxData!),
                    maskData = Convert.FromBase64String(locationDataTemp.maskData!),
                    dateCreated = locationDataTemp.dateCreated,
                    horisonElevationData = locationDataTemp.horisonElevationData
                };
                return locationData!;
            }else if (response.StatusCode == HttpStatusCode.NotFound)
            {
                Console.WriteLine(".NET LocationData not found");
                return null!;
            }
            else
            {
                Console.WriteLine(".NET Error getting LocationData");
                throw new Exception("Error getting LocationData");
            }

        }
        catch (System.Exception)
        {
            throw new Exception("Could not get LocationData");
        }
    }

    public async Task<string> CreateLocationData(
        double latitude,
        double longitude,
        string locationName
      
    )
    {

        
        LocationDataModel? locationData = await GetLocationDataModel(latitude, longitude);
        if(locationData!=null){
            return "LocationData could not be created";
        }
        string solarPanelsData = locationData!.solarPanelsData!.ToString()!;
        byte[] satteliteImageData = locationData!.satteliteImageData!;
        byte[] annualFluxData = locationData!.annualFluxData!;
        byte[] monthlyFluxData = locationData!.monthlyFluxData!;
        byte[] maskData = locationData!.maskData!;
        string horisonElevationData = locationData!.horisonElevationData!;
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Post,
                express + "/api/locationData/create"
            );
            string satteliteImageDataBase64 = Convert.ToBase64String(satteliteImageData);
            string annualFluxDataBase64 = Convert.ToBase64String(annualFluxData);
            string monthlyFluxDataBase64 = Convert.ToBase64String(monthlyFluxData);
            string maskDataBase64 = Convert.ToBase64String(maskData);

            var postData = new
            {
                latitude = latitude.ToString(),
                longitude = longitude.ToString(),
                locationName = locationName,
                solarPanelsData = solarPanelsData,
                satteliteImageData = satteliteImageDataBase64,
                annualFluxData = annualFluxDataBase64,
                monthlyFluxData = monthlyFluxDataBase64,
                maskData = maskDataBase64,
                horisonElevationData = horisonElevationData
            };

            var json = System.Text.Json.JsonSerializer.Serialize(postData);
            request.Content = new StringContent(json, null, "application/json");
            // Console.WriteLine(await request.Content.ReadAsStringAsync());
            var response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                Console.WriteLine(".NET LocationData created successfully");
                return "LocationData created successfully";
            }
            else if (response.StatusCode == HttpStatusCode.BadRequest)
            {
                Console.WriteLine(".NET Bad Request When Creating LocationData");
                // Get error
                string data = response.Content.ReadAsStringAsync().Result;
                return data;
            }
            else
            {
                Console.WriteLine(".NET Error creating LocationData");
                throw new Exception("Error creating LocationData");
            }

        }
        catch (System.Exception)
        {
            throw new Exception("Could not create locationData");
        }
    }

    public async Task<string> GetLocationNameFromCoordinates(double latitude, double longitude)
    {
        string baseUrl = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
        string requestUrl =
            $"{baseUrl}{longitude.ToString().Replace(",", ".")},{latitude.ToString().Replace(",", ".")}.json?&access_token={mapboxAccessToken}";

        try
        {
            HttpClient httpClient = new HttpClient();
            var mapResponse = await httpClient.GetFromJsonAsync<GeocodingResponse>(requestUrl);
            return mapResponse?.Features[0].Place_Name ?? "";
        }
        catch (Exception ex)
        {
            // Handle any errors or exceptions
            Console.WriteLine(ex.Message);
            return "";
        }
    }
    private class GeocodingResponse
    {
        public List<LocationSuggestion> Features { get; set; } = new List<LocationSuggestion>();
    }
}