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

    public async Task<object> GetProcessedDataAsync(BusinessRequestData requestData)
    {
        string typeOfData = "Solar Irradiance";
        LocationDataModel? currentLocationData = new LocationDataModel();
        try
        {
            var data = requestData.data;
            double latitude = requestData.latitude;
            double longitude = requestData.longitude;

            var client = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Get, express + "/api/locationData/" + latitude + "/" + longitude);

            var returnDataJson = new object();
            typeOfData = data!;
            switch(data!.ToLower()){
                case DataType.SOLAR_SCORE : 
                    var solarScore = await GetSolarScore(latitude, longitude);
                    returnDataJson = System.Text.Json.JsonSerializer.Deserialize<SolarScore>(JsonConvert.SerializeObject(solarScore));
                    break;
                case DataType.SOLAR_ARRAY : 
                    var solarArray = await GetSolarRadiationList(latitude, longitude);
                    returnDataJson = System.Text.Json.JsonSerializer.Deserialize<List<DateRadiationModel>>(JsonConvert.SerializeObject(solarArray));
                    break;
                case DataType.SATELLITE_IMAGE : 
                    var satelliteImage = await GetSatelliteImage(latitude, longitude);
                    returnDataJson = System.Text.Json.JsonSerializer.Deserialize<Base64Image>(JsonConvert.SerializeObject(satelliteImage));
                    break;
                case DataType.ADDRESS :
                    var address = getAddress();
                    returnDataJson = System.Text.Json.JsonSerializer.Deserialize<Address>(JsonConvert.SerializeObject(address));
                    break;
                case DataType.SUNLIGHT_HOURS :
                    var sunlightHours = GetSunlightHours(latitude, longitude);
                    returnDataJson = System.Text.Json.JsonSerializer.Deserialize<SunlightHours>(JsonConvert.SerializeObject(sunlightHours));
                    break;
                default : 
                    returnDataJson = "Invalid data type";
                    break;
            }
           
            return returnDataJson!;
           
        }
        catch (System.Exception e)
        {
            Console.WriteLine(e);
            throw e;
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
            Console.WriteLine("Creating LocationData");
            await CreateLocationData(latitude, longitude);
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
        double longitude
    )
    {
        string? elevationData = await GetHorisonElevationData(latitude, longitude);
        if (elevationData == null)
        {
            Console.WriteLine("Elevation data not found");
            return null;
        }
        Console.WriteLine("1");
        string horisonElevationData = elevationData;

        LocationDataModel? locationData = await GetRoofData(latitude, longitude);
        if (locationData == null)
        {
            Console.WriteLine("Rooftop data not found");
            return null;
        }
        

        
        RooftopInformationModel solarPanelsData = locationData!.solarPanelsData!;
        byte[] satteliteImageData = locationData!.satteliteImageData!;
        byte[] annualFluxData = locationData!.annualFluxData!;
        byte[] monthlyFluxData = locationData!.monthlyFluxData!;
        byte[] maskData = locationData!.maskData!;
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Post,
                express + "/api/locationData/create"
            );
            Console.WriteLine("3");
            string satteliteImageDataBase64 = Convert.ToBase64String(satteliteImageData);
            string annualFluxDataBase64 = Convert.ToBase64String(annualFluxData);
            string monthlyFluxDataBase64 = Convert.ToBase64String(monthlyFluxData);
            string maskDataBase64 = Convert.ToBase64String(maskData);

            var postData = new
            {
                latitude = latitude.ToString(),
                longitude = longitude.ToString(),
                locationName = GetLocationNameFromCoordinates(latitude, longitude).Result,
                solarPanelsData = System.Text.Json.JsonSerializer.Serialize(solarPanelsData),
                satteliteImageData = satteliteImageDataBase64,
                annualFluxData = annualFluxDataBase64,
                monthlyFluxData = monthlyFluxDataBase64,
                maskData = maskDataBase64,
                horisonElevationData = horisonElevationData
            };
            Console.WriteLine("4");

            var json = System.Text.Json.JsonSerializer.Serialize(postData);
            request.Content = new StringContent(json, null, "application/json");
            // Console.WriteLine(await request.Content.ReadAsStringAsync());
            Console.WriteLine("5");
            var response = await client.SendAsync(request);
            Console.WriteLine("6");
            if (response.IsSuccessStatusCode)
            {
                Console.WriteLine("7");
                Console.WriteLine(".NET LocationData created successfully");
                return "LocationData created successfully";
            }
            else if (response.StatusCode == HttpStatusCode.BadRequest)
            {
                Console.WriteLine("8");
                Console.WriteLine(".NET Bad Request When Creating LocationData");
                // Get error
                string data = response.Content.ReadAsStringAsync().Result;
                return data;
            }
            else
            {
                Console.WriteLine("9");
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
    public async Task<string?> GetHorisonElevationData(double latitude, double longitude)
    {
        string url = $"https://api.globalsolaratlas.info/data/horizon?loc={latitude.ToString().Replace(",", ".")},{longitude.ToString().Replace(",", ".")}";
        var client = new HttpClient();
        var response = await client.GetAsync(url);
        if (response.IsSuccessStatusCode)
        {
            var data = await response.Content.ReadAsStringAsync();
            return data;
        }
        return null;
    }
     private async Task<LocationDataModel?> GetRoofData(double latitude, double longitude)
    {
        LocationDataModel result = new LocationDataModel();
        result.latitude = latitude;
        result.longitude = longitude;
        RooftopInformationModel? solarPanelsDataResult = await GetSolarPannelsData(
            latitude,
            longitude
        );

        if (solarPanelsDataResult == null)
        {
            Console.WriteLine("Solar panels data not found");
            return null;
        }

        result.solarPanelsData = solarPanelsDataResult;

        LocationDataLayer? locationDataLayer = await GetLocationDataLayer(latitude, longitude);

        if (locationDataLayer == null)
        {
            Console.WriteLine("Location data layer not found");
            return null;
        }

        var byteDataTask1 = GetLocationDataFromDataLayerUrl(locationDataLayer.rgbUrl!);
        var byteDataTask2 = GetLocationDataFromDataLayerUrl(locationDataLayer.maskUrl!);
        var byteDataTask3 = GetLocationDataFromDataLayerUrl(locationDataLayer.annualFluxUrl!);
        var byteDataTask4 = GetLocationDataFromDataLayerUrl(locationDataLayer.monthlyFluxUrl!);

        await Task.WhenAll(
            byteDataTask1,
            byteDataTask2,
            byteDataTask3,
            byteDataTask4
        );

        if (
            byteDataTask1.Result == null
            || byteDataTask2.Result == null
            || byteDataTask3.Result == null
            || byteDataTask4.Result == null
        )
        {
            Console.WriteLine("One or more data requests failed");
            return null;
        }

        result.satteliteImageData = byteDataTask1.Result;
        result.maskData = byteDataTask2.Result;
        result.annualFluxData = byteDataTask3.Result;
        result.monthlyFluxData = byteDataTask4.Result;
        result.dateCreated = DateTime.Now;

        return result;
    }
    private async Task<RooftopInformationModel?> GetSolarPannelsData(double latitude, double longitude)
    {
        string requiredQuality = "HIGH";
        string? api_key = Environment.GetEnvironmentVariable("GOOGLE_MAPS_API_KEY");

        if (api_key == null)
        {
            Console.WriteLine("API key not found");
            return null;
        }

        string url =
            "https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude="
            + latitude
            + "&location.longitude="
            + longitude
            + "&requiredQuality="
            + requiredQuality
            + "&key="
            + api_key;
        var client = new HttpClient();
        var response = await client.GetAsync(url);
        if (response.IsSuccessStatusCode)
        {
            var data = await response.Content.ReadAsStringAsync();
            return System.Text.Json.JsonSerializer.Deserialize<RooftopInformationModel>(data);
        }
        return null;
    }
    private async Task<LocationDataLayer?> GetLocationDataLayer(double latitude, double longitude)
    {
        LocationDataLayer result = new LocationDataLayer();
        int radiusMeters = 50;
        string view = "IMAGERY_AND_ALL_FLUX_LAYERS";
        string requiredQuality = "MEDIUM";
        double pixelSizeMeters = 0.25;
        string? api_key = Environment.GetEnvironmentVariable("GOOGLE_MAPS_API_KEY");
        if (api_key == null)
        {
            Console.WriteLine("API key not found");
            return null;
        }

        string url =
            "https://solar.googleapis.com/v1/dataLayers:get?location.latitude="
            + latitude
            + "&location.longitude="
            + longitude
            + "&radiusMeters="
            + radiusMeters
            + "&view="
            + view
            + "&requiredQuality="
            + requiredQuality
            + "&pixelSizeMeters="
            + pixelSizeMeters
            + "&key="
            + api_key;
        var client = new HttpClient();
        var response = await client.GetAsync(url);
        if (response.IsSuccessStatusCode)
        {
            var data = await response.Content.ReadAsStringAsync();
            return System.Text.Json.JsonSerializer.Deserialize<LocationDataLayer>(data);
        }
        return null;
    }
     private async Task<byte[]?> GetLocationDataFromDataLayerUrl(string url)
    {
        string? api_key = Environment.GetEnvironmentVariable("GOOGLE_MAPS_API_KEY");
        if (api_key == null)
        {
            Console.WriteLine("API key not found");
            return null;
        }
        var client = new HttpClient();
        Console.WriteLine("Getting data from url: " + url + "&key=" + api_key);
        var response = await client.GetAsync(url + "&key=" + api_key);
        if (response.IsSuccessStatusCode)
        {
            Console.WriteLine("Data found");
            return await response.Content.ReadAsByteArrayAsync();
        }
        return null;
    }
    private class GeocodingResponse
    {
        public List<LocationSuggestion> Features { get; set; } = new List<LocationSuggestion>();
    }
}