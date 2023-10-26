using System.Net;
using Newtonsoft.Json;

namespace Api.Repository;

public class BusinessBestSolarPanelsRepository
{ 
    private DataHandlers.SolarDataHandler solarCalculator = new DataHandlers.SolarDataHandler();
    private DataHandlers.RooftopDataHandler rooftopDataHandler = new DataHandlers.RooftopDataHandler();
    private string locationName = "";
    private string? mapboxAccessToken = Environment.GetEnvironmentVariable("MAP_BOX_API_KEY");
    private string express = "http://localhost:3333";
   
    public BusinessBestSolarPanelsRepository()
    {
        var backendexpress = Environment.GetEnvironmentVariable("EXPRESS_BACKEND");
        if (backendexpress != null)
        {
            express = backendexpress;
        }
    }
    public async Task<List<BestSolarPanelsOutput>> GetProcessedDataAsync(BestSolarPanelsInput bestSolarPanelsInput)
    {
        var returnDataJson = new object();
        LocationDataModel? currentLocationData = new LocationDataModel();
        try
        {
            int numPanels = bestSolarPanelsInput.total_panels ?? 0;
            double latitude = bestSolarPanelsInput.latitude;
            double longitude = bestSolarPanelsInput.longitude;

            var client = new HttpClient();
            var dataTypeResponse = new HttpResponseMessage();

            if(numPanels==0)
            {
                throw new Exception("Number of panels cannot be left out, or be zero.");
            } else if(numPanels<0)
            {
                throw new Exception("Number of panels cannot be negative.");
            }

            // LocationDataModel? locationData = await GetLocationData(latitude, longitude);
            // locationName = await GetLocationNameFromCoordinates(latitude, longitude);
            // if (locationData == null)
            // {                
            //     await CreateLocationData(latitude, longitude, locationName);
            // }
            List<BestSolarPanelsOutput> solarPanels = await GetBestSolarPanelsOutputAsync(numPanels, latitude, longitude);
            return solarPanels;
        }
        catch (Exception)
        {
            throw new Exception("Could not create Solar Panel Orientation Data. NOTE that a valid address should be used.");
 
        }
    }

    private async Task<List<BestSolarPanelsOutput>> GetBestSolarPanelsOutputAsync(int numPanels, double latitude, double longitude)
    {
        LocationDataModel? locationData = await GetLocationData(latitude, longitude);
        List<Solarpanel> solarPanels = solarCalculator.getBestSolarPanels(numPanels, locationData!.solarPanelsData!)!;
        List<BestSolarPanelsOutput> bestSolarPanelsOutputs = convertSolarPanelsToBestSolarPanelsOutput(solarPanels);
        return bestSolarPanelsOutputs;
    }
    private List<BestSolarPanelsOutput> convertSolarPanelsToBestSolarPanelsOutput(List<Solarpanel> solarPanels)
    {
        List<BestSolarPanelsOutput> bestSolarPanels = new List<BestSolarPanelsOutput>();
        foreach(Solarpanel solarPanel in solarPanels)
        {
            BestSolarPanelsOutput bestSolarPanel = new BestSolarPanelsOutput();
            bestSolarPanel.orientation = solarPanel.orientation!;
            bestSolarPanel.yearlyEnergyDcKwh = solarPanel.yearlyEnergyDcKwh!;
            bestSolarPanel.latitude = solarPanel.center!.latitude!;
            bestSolarPanel.longitude = solarPanel.center!.longitude!;
            bestSolarPanels.Add(bestSolarPanel);
        }
        return bestSolarPanels;
    }
    private async Task<LocationDataModel> GetLocationDataModel(double latitude, double longitude)
    {
        LocationDataModel? locationData = await GetLocationData(latitude, longitude);
        if(locationData==null){
            Console.WriteLine("Creating LocationData");
            await CreateLocationData(latitude, longitude, locationName);
            locationData = await GetLocationData(latitude, longitude);
        }
        return locationData!;
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
    private class GeocodingResponse
    {
        public List<LocationSuggestion> Features { get; set; } = new List<LocationSuggestion>();
    }
}
