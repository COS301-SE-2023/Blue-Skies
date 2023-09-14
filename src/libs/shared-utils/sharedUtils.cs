using System;
using System.Text.Json;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;

namespace SharedUtils;

public class locationDataClass {
    private string? API_PORT = Environment.GetEnvironmentVariable("API_PORT");

    /// <summary>
    /// Get's the location data from the database.
    /// <paramref name="latitude"/> The latitude of the current location.
    /// <paramref name="longitude"/> The longitude of the current location.
    /// </summary>
    public async Task<LocationDataModel?> GetLocationData(double latitude, double longitude){
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Get, API_PORT + "/locationData/getLocationData/" + latitude.ToString().Replace(",",".") + "/" + longitude.ToString().Replace(",","."));
        var response = await client.SendAsync(request);
        if (response.IsSuccessStatusCode) {
            var data = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<LocationDataModel>(data)!;
            return result;
        }
        return null;
    }
    
    /// <summary>
    /// Get's the location data from the database except for the image.
    /// <paramref name="latitude"/> The latitude of the current location.
    /// <paramref name="longitude"/> The longitude of the current location.
    /// </summary>
    public async Task<LocationDataModel?> GetLocationDataNoImage(double latitude, double longitude) {
        string url = $"https://api.globalsolaratlas.info/data/horizon?loc={latitude.ToString().Replace(",",".")},{longitude.ToString().Replace(",",".")}";
        Console.WriteLine("URL: " + url);
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Get, API_PORT + "/locationData/GetLocationDataWithoutImage/" + latitude.ToString().Replace(",",".") + "/" + longitude.ToString().Replace(",","."));
        var response = await client.SendAsync(request);
        if (response.IsSuccessStatusCode) {
            var data = await response.Content.ReadAsStringAsync();
            if (data.Equals("Solar Irradiation not found"))
            {
                return null;
            }
            data = response.Content.ReadAsStringAsync().Result;
            return JsonSerializer.Deserialize<LocationDataModel>(data)!;
        } else {
            Console.WriteLine("Location data not found - fetching data instead");
        }
        return null;
    }
    
    /// <summary>
    /// <list type="number">
    ///     <item>Creates a new row in the database for the location data. </item>
    ///     <item>Calls the python API to get the solar irradiation data for that location.</item>
    /// </list>
    /// <paramref name="latitude"/> The latitude of the current location.
    /// <paramref name="longitude"/> The longitude of the current location.
    /// <paramref name="daylightHours"/> The daylight hours for the current location.
    /// <paramref name="image"/> The image of the current location.
    /// <paramref name="location"/> The name of the current location.
    /// </summary>
    public async Task<LocationDataModel?> CreateLocationData(double latitude, double longitude, string locationName) 
    {
        LocationDataModel result = new LocationDataModel();
        result.latitude = latitude;
        result.longitude = longitude;
        result.locationName = locationName;

        InitialDataModel initialData = await GetInitialData(latitude, longitude);
        if(initialData == null) {
            Console.WriteLine("Initial data not found");
            return null;
        }
        result.daylightHours = (float)Math.Round(initialData.averageSunlightHours, 2);
        
        string? elevationData = await GetHorisonElevationData(latitude, longitude);
        if(elevationData == null) {
            Console.WriteLine("Elevation data not found");
            return null;
        }
        result.horisonElevationData = elevationData;

        LocationDataModel? locationData = await GetRoofData(latitude, longitude);
        if(locationData == null) {
            Console.WriteLine("Rooftop data not found");
            return null;
        }

        result.solarPanelsData = locationData.solarPanelsData;
        result.satteliteImageData = locationData.satteliteImageData;
        result.satteliteImageElevationData = locationData.satteliteImageElevationData;
        result.annualFluxData = locationData.annualFluxData;
        result.monthlyFluxData = locationData.monthlyFluxData;
        result.maskData = locationData.maskData;
        result.dateCreated = DateTime.Now;

        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Post, API_PORT + "/locationData/create");
        var json = JsonSerializer.Serialize(result);
        request.Content = new StringContent(json, null, "application/json");
        var response = await client.SendAsync(request);
        
        if (response.IsSuccessStatusCode)
        {
            return result;
        }
        return null;
    }

    private async Task<LocationDataModel?> GetRoofData(double latitude, double longitude)
{
    LocationDataModel result = new LocationDataModel();
    result.latitude = latitude;
    result.longitude = longitude;
    RooftopInformationModel? solarPanelsDataResult = await GetSolarPannelsData(latitude, longitude);
    
    if (solarPanelsDataResult == null)
    {
        Console.WriteLine("Solar panels data not found");
        return null;
    }

    result.solarPanelsData = JsonSerializer.Serialize(solarPanelsDataResult);

    LocationDataLayer? locationDataLayer = await GetLocationDataLayer(latitude, longitude);

    if (locationDataLayer == null)
    {
        Console.WriteLine("Location data layer not found");
        return null;
    }

    var byteDataTask1 = GetLocationDataFromDataLayerUrl(locationDataLayer.dsmUrl!);
    var byteDataTask2 = GetLocationDataFromDataLayerUrl(locationDataLayer.rgbUrl!);
    var byteDataTask3 = GetLocationDataFromDataLayerUrl(locationDataLayer.maskUrl!);
    var byteDataTask4 = GetLocationDataFromDataLayerUrl(locationDataLayer.annualFluxUrl!);
    var byteDataTask5 = GetLocationDataFromDataLayerUrl(locationDataLayer.monthlyFluxUrl!);

    await Task.WhenAll(byteDataTask1, byteDataTask2, byteDataTask3, byteDataTask4, byteDataTask5);

    if (byteDataTask1.Result == null || byteDataTask2.Result == null || byteDataTask3.Result == null ||
        byteDataTask4.Result == null || byteDataTask5.Result == null)
    {
        Console.WriteLine("One or more data requests failed");
        return null;
    }

    result.satteliteImageElevationData = byteDataTask1.Result;
    result.satteliteImageData = byteDataTask2.Result;
    result.maskData = byteDataTask3.Result;
    result.annualFluxData = byteDataTask4.Result;
    result.monthlyFluxData = byteDataTask5.Result;
    result.dateCreated = DateTime.Now;

    return result;
}

    private async Task<byte[]?> GetLocationDataFromDataLayerUrl(string url) {
        string? api_key = Environment.GetEnvironmentVariable("GOOGLE_MAPS_API_KEY");
        if(api_key == null) {
            Console.WriteLine("API key not found");
            return null;
        }
        var client = new HttpClient();
        Console.WriteLine("Getting data from url: " + url + "&key=" + api_key);
        var response = await client.GetAsync(url + "&key=" + api_key);
        if (response.IsSuccessStatusCode) {
            Console.WriteLine("Data found");
            return await response.Content.ReadAsByteArrayAsync();
        }
        return null;
    }

    private async Task<LocationDataLayer?> GetLocationDataLayer(double latitude, double longitude) {
        LocationDataLayer result = new LocationDataLayer();
        int radiusMeters = 50;
        string view = "IMAGERY_AND_ALL_FLUX_LAYERS";
        string requiredQuality = "MEDIUM";
        double pixelSizeMeters = 0.25;
        string? api_key = Environment.GetEnvironmentVariable("GOOGLE_MAPS_API_KEY");
        if(api_key == null) {
            Console.WriteLine("API key not found");
            return null;
        }

        string url = "https://solar.googleapis.com/v1/dataLayers:get?location.latitude=" + latitude + "&location.longitude=" + longitude + "&radiusMeters=" + radiusMeters + "&view=" + view + "&requiredQuality=" + requiredQuality + "&pixelSizeMeters=" + pixelSizeMeters + "&key=" + api_key;
        var client = new HttpClient();
        var response = await client.GetAsync(url);
        if (response.IsSuccessStatusCode) {
            var data = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<LocationDataLayer>(data);
        }
        return null;
    }

    private async Task<RooftopInformationModel?> GetSolarPannelsData(double latitude, double longitude) {
        string requiredQuality = "HIGH";
        string? api_key = Environment.GetEnvironmentVariable("GOOGLE_MAPS_API_KEY");

        if(api_key == null) {
            Console.WriteLine("API key not found");
            return null;
        }

        string url = "https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=" + latitude + "&location.longitude=" + longitude + "&requiredQuality=" + requiredQuality + "&key=" + api_key;
        var client = new HttpClient();
        var response = await client.GetAsync(url);
        if (response.IsSuccessStatusCode) {
            var data = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<RooftopInformationModel>(data);
        }
        return null;
    }

    /// <summary>
    /// <para>Gets the elevation data for the given location.</para>
    /// <paramref name="latitude"/> The latitude of the location.
    /// <paramref name="longitude"/> The longitude of the location.
    /// </summary>
    private async Task<string?> GetHorisonElevationData(double latitude, double longitude) {
        string url = $"https://api.globalsolaratlas.info/data/horizon?loc={latitude.ToString().Replace(",",".")},{longitude.ToString().Replace(",",".")}";
        var client = new HttpClient();
        var response = await client.GetAsync(url);
        if (response.IsSuccessStatusCode) {
            var data = await response.Content.ReadAsStringAsync();
            return data;
        }
        return null;
    }
    
    /// <summary>
    /// <para>Calls the weather visualcrossing api to get quick initial data.</para>
    /// <paramref name="latitude"/> The latitude of the current location.
    /// <paramref name="longitude"/> The longitude of the current location.
    /// <returns> averageSunlightHours and averageSolarIrradiation</returns>
    /// </summary>
    private async Task<InitialDataModel> GetInitialData(double latitude, double longitude)
    {
        var data = new List<WeatherData>();
        // Initial api key to get the last 15 day's of information:
        var client = new HttpClient();
        var apiKey = Environment.GetEnvironmentVariable("VISUAL_CROSSING_WEATHER_API_KEY");
        var apiUrl = $"https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/{latitude.ToString().Replace(",",".")},{longitude.ToString().Replace(",",".")}?unitGroup=metric&include=days&key={apiKey}&elements=sunrise,sunset,temp,solarenergy,solarradiation,datetime";
       
        Console.WriteLine("client: "+client.ToString());
        Console.WriteLine("url: "+apiUrl);
        var apiData = await FetchWeatherDataAsync(client, apiUrl);
        if(apiData != null) {
            data.Add(apiData);
        }
        else {
            Console.WriteLine("apiData is null");
        }
        
        //  11 other calls to get the last 10 month's data
        var currentMonth = DateTime.Now.Month;
        var tasks = new List<Task<WeatherData>>();

        for (var i = 1; i < 12; i++)
        {
            var month = currentMonth - i;
            if (month < 1)
            {
                month = 12 + month;
            }
            var year = DateTime.Now.Year;
            if (month > currentMonth)
            {
                year = year - 1;
            }
            var monthString = month.ToString();
            if (month < 10)
            {
                monthString = "0" + monthString;
            }
            client = new HttpClient();
            apiUrl = $"https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/{latitude.ToString().Replace(",",".")},{longitude.ToString().Replace(",",".")}/{year}-{monthString}-15/{year}-{monthString}-15?unitGroup=metric&include=days&key={apiKey}&elements=sunrise,sunset,temp,solarenergy,solarradiation,datetime";

            // Asynchronously fetch the data and add the task to the list
            tasks.Add(FetchWeatherDataAsync(client, apiUrl)!);
        }

        // Wait for all tasks to complete
        await Task.WhenAll(tasks);

        // Extract the results from completed tasks
        var completedResults = tasks
            .Where(task => task.Status == TaskStatus.RanToCompletion)
            .Select(task => task.Result)
            .ToList();

        // Now, completedResults contains the fetched data for all 10 months
        foreach (var result in completedResults)
        {
            if (result != null)
            {
                data.Add(result);
            }
        }

        // Get averageSolarIrradiation and daylightHours from the data
        var averageSunlightHours = 0f;
        var averageSolarIrradiation = 0.0;
        for(var i = 0; i < data.Count; i++) {
            if(data[i] == null || data[i].days == null) {
                Console.WriteLine("Data is null");
                continue;
            }

            var averageSolarIrradiationMonth = 0.0;
            var monthSunlightHours = 0f;

          
            for(var j = 0; j < data[i].days!.Count; j++) {
                var sunrise = data[i].days![j].sunrise;
                var sunset = data[i].days![j].sunset;
                var sunriseSplit = sunrise!.Split(":");
                var sunsetSplit = sunset!.Split(":");
                var sunriseTotalHours =  float.Parse(sunriseSplit[0]) + (float.Parse(sunriseSplit[1]) / 60);
                var sunsetTotalHours = float.Parse(sunsetSplit[0]) + (float.Parse(sunsetSplit[1]) / 60);
                var daylightHours = sunsetTotalHours - sunriseTotalHours;
                monthSunlightHours += daylightHours;

                averageSolarIrradiationMonth += data[i].days![j].solarradiation;
            }
            monthSunlightHours = monthSunlightHours / data[i].days!.Count;
            averageSunlightHours += monthSunlightHours;

            averageSolarIrradiationMonth = averageSolarIrradiationMonth / data[i].days!.Count;
            averageSolarIrradiation += averageSolarIrradiationMonth;
        }
        averageSunlightHours = averageSunlightHours / data.Count;
        averageSunlightHours = (float)Math.Round(averageSunlightHours, 2);
        averageSolarIrradiation = averageSolarIrradiation / data.Count;

        InitialDataModel initialData = new InitialDataModel();
        initialData.averageSunlightHours = averageSunlightHours;
        initialData.averageSolarIrradiation = averageSolarIrradiation;
        return initialData;
    }

    /// <summary>
    /// <para>Fetches the weather data from the visualcrossing api.</para>
    /// <paramref name="client"/> The http client.
    /// <paramref name="apiUrl"/> The url to the api.
    /// </summary>
    private async Task<WeatherData?> FetchWeatherDataAsync(HttpClient client, string apiUrl)
    {
      
        try
        {
            var response = await client.GetAsync(apiUrl);
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync();
                if (result != null && result.Length > 0 && result[0] == '{')
                {
                    return JsonSerializer.Deserialize<WeatherData>(result);
                }
            }
            else
            {
                Console.WriteLine($"Failed to call the API. Status code: {response.StatusCode}");
            }
        }
        catch (HttpRequestException ex)
        {
            Console.WriteLine($"HTTP Request Error: {ex.Message}");
        }

        // If any error occurred, return null or an appropriate default value
        return null;
    }
}

public class systemClass {
    private string? API_PORT = Environment.GetEnvironmentVariable("API_PORT");

    /// <summary>
    /// <list type="bullet">
    ///     <item>Get all the systems from the database</item>
    ///     <item>Save the systems to the systems variable</item>
    ///     <item>Save the systems to the session storage</item>
    /// </list>
    /// </summary>
    public async Task<List<SystemModel>> GetAllSystems()
    {
        List<SystemModel> systems = new List<SystemModel>();
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Get, API_PORT + "/System/all");
        var response = await client.SendAsync(request);
        if (response.StatusCode == System.Net.HttpStatusCode.OK)
        {
            var data = await response.Content.ReadAsStringAsync();
            systems = JsonSerializer.Deserialize<List<SystemModel>>(data, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            })!;
        }
        else
        {
            Console.WriteLine("Failed in Results when getting systems");
        }
        return systems;
    }

    public async Task<SystemModel?> GetSystem(int systemId)
    {
        SystemModel? system = null;
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Get, API_PORT + "/System/get/" + systemId);
        var response = await client.SendAsync(request);
        if (response.StatusCode == System.Net.HttpStatusCode.OK)
        {
            var data = await response.Content.ReadAsStringAsync();
            system = JsonSerializer.Deserialize<SystemModel>(data, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive =
            true
            })!;
        }
        else
        {
            Console.WriteLine("Failed to get systems");
        }
        return system;
    }

    public async Task<bool> DeleteSystem(int id)
    {
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Delete, API_PORT + "/system/delete");
        var content = new StringContent("{\r\n \"systemId\": " + id + "\r\n}", null, "application/json");
        request.Content = content;
        var response = await client.SendAsync(request);
        return response.IsSuccessStatusCode;
    }

    public async Task<bool> CreateSystem(SystemModel system) {
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Post, API_PORT + "/System/create");
        var content = new StringContent("{\r\n \"systemSize\": \"" + system.systemSize + "\",\r\n \"inverterOutput\": " +
        system.inverterOutput + ",\r\n \"numberOfPanels\": " + system.numberOfPanels + ",\r\n \"batterySize\": " +
        system.batterySize + ",\r\n \"numberOfBatteries\": " + system.numberOfBatteries + ",\r\n \"solarInput\": " +
        system.solarInput + "\r\n}", null, "application/json");
        request.Content = content;
        var response = await client.SendAsync(request);
        return response.IsSuccessStatusCode;
    }

    public async Task<bool> UpdateSystem(SystemModel system) {
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Patch, API_PORT + "/System/update");
        var content = new StringContent("{\r\n \"systemId\": " + system.systemId + ",\r\n \"inverterOutput\": " +
        system.inverterOutput + ",\r\n \"numberOfPanels\": " + system.numberOfPanels + ",\r\n \"batterySize\": " +
        system.batterySize + ",\r\n \"numberOfBatteries\": " + system.numberOfBatteries + ",\r\n \"solarInput\": " +
        system.solarInput + "\r\n}", null, "application/json");
        request.Content = content;
        var response = await client.SendAsync(request);
        return response.IsSuccessStatusCode;
    }

}

public class reportClass {
    private string? API_PORT = Environment.GetEnvironmentVariable("API_PORT");

    public async Task<List<ReportModel>> GetUserReports(int userId)
    {
        List<ReportModel> reports = new List<ReportModel>();
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Get, API_PORT + "/Report/getUserReports/" + userId);
        var response = await client.SendAsync(request);
        if (response.StatusCode == System.Net.HttpStatusCode.OK)
        {
            var data = await response.Content.ReadAsStringAsync();
            reports = JsonSerializer.Deserialize<List<ReportModel>>(data, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                })!;
        }
        else
        {
            Console.WriteLine("Failed to get user reports");
        }
        return reports;
    }

    public async Task<ReportModel?> GetReport(int reportId)
    {
        ReportModel? report = null;
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Get, API_PORT + "/Report/get/" + reportId);
        var response = await client.SendAsync(request);
        if (response.IsSuccessStatusCode)
        {
            var responseStream = await response.Content.ReadAsStringAsync();
            var options = new JsonSerializerOptions 
            {
                PropertyNameCaseInsensitive = true
            };

            return JsonSerializer.Deserialize<ReportModel>(responseStream, options);
        }
        else
        {
            Console.WriteLine("Report not found");
        }
        return report;
    }

    // <summary>
    /// Create a new report in the database
    /// </summary>
    public async Task<bool> CreateReport(string calculationName, int userId, string homeSize, double latitude, double longitude, int systemId) {
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Post, API_PORT + "/Report/create");
        var content = new StringContent(
            "{\r\n    \"reportName\" : \""
                    + calculationName
                    + "\",\r\n    \"userId\" : "
                    + userId
                    + ",\r\n    \"homeSize\" : \""
                    + homeSize
                    + "\",\r\n    \"latitude\" : \""
                    + latitude
                    + "\",\r\n    \"longitude\" : \""
                    + longitude
                    + "\",\r\n    \"systemId\" : "
                    + systemId
                    + "\r\n}",
        null, "application/json");
        request.Content = content;
        var response = await client.SendAsync(request);
        if(response.StatusCode == System.Net.HttpStatusCode.OK)
        {
            return true;
        }
        else
        {
            Console.WriteLine("Failed to create report");
        }
        return false;
    }
    
    /// <summary>
    /// Updates the report in the database
    public async Task<bool> UpdateReport(int reportId, string calculationName, int userId, string homeSize, double latitude, double longitude, int systemId) {
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Patch, API_PORT + "/Report/update");
        var content = new StringContent("{\r\n    \"reportId\" : "
                    + reportId
                    + ",\r\n    \"reportName\" : \""
                    + calculationName
                    + "\",\r\n    \"userId\" : "
                    + userId
                    + ",\r\n    \"homeSize\" : \""
                    + homeSize
                    + "\",\r\n    \"latitude\" : \""
                    + latitude.ToString().Replace(",",".")
                    + "\",\r\n    \"longitude\" : \""
                    + longitude.ToString().Replace(",",".")
                    + "\",\r\n    \"systemId\" : "
                    + systemId
                    + "\r\n}", null, "application/json");
        request.Content = content;
        var response = await client.SendAsync(request);
        if(response.StatusCode == System.Net.HttpStatusCode.OK)
        {
            return true;

        }
        else
        {
            Console.WriteLine("Failed to update report");
        }
        return false;
    }

    /// <summary>
    /// Delete the current report from the database
    /// </summary>
    public async Task<bool> DeleteReport(int reportId)
    {
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Delete, API_PORT + "/Report/delete");
        
        var content = new StringContent("{\r\n \"reportId\": " + reportId + "\r\n}", null, "application/json");
        request.Content = content;
        var response = await client.SendAsync(request);
        if (response.StatusCode == System.Net.HttpStatusCode.OK)
        {
            return true;
        }
        else
        {
            Console.WriteLine("Failed to delete report");
        }
        return false;
    }

    public async Task<byte[]> GenerateReport(int userId, int reportId) {
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Get, API_PORT+ "/Report/downloadReport/" + userId + "/" + reportId);
        request.Headers.Add("Accept", "application/pdf");
        var response = await client.SendAsync(request);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadAsByteArrayAsync();
    }
}

public class applianceClass {
    private string? API_PORT = Environment.GetEnvironmentVariable("API_PORT");
    /// <summary>
    /// <list type="bullet">
    ///     <item>Get all the appliances from the database</item>
    ///     <item>Save the appliances to the appliances variable</item>
    ///     <item>Save the appliances to the session storage</item>
    /// </list>
    /// </summary>
    public async Task<List<ApplianceModel>> GetAllAppliances()
    {
        var appliances = new List<ApplianceModel>();
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Get, API_PORT + "/Appliance/all");
        var response = await client.SendAsync(request);
        if (response.StatusCode == System.Net.HttpStatusCode.OK)
        {
            var data = await response.Content.ReadAsStringAsync();
            appliances = JsonSerializer.Deserialize<List<ApplianceModel>>(data, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            })!;
        }
        else
        {
            Console.WriteLine("Failed in Results when getting appliances");
        }
        return appliances;
    }

    public async Task<bool> CreateAppliance(string type, int powerUsage) {
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Post, API_PORT + "/Appliance/create");
        var content = new StringContent("{\r\n \"type\": \"" + type + "\",\r\n \"powerUsage\": " + powerUsage + "\r\n}", null, "application/json");
        request.Content = content;
        var response = await client.SendAsync(request);
        return response.IsSuccessStatusCode;
    }

    public async Task<bool> UpdateAppliance(int applianceId, string type, int powerUsage) {
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Patch, API_PORT + "/Appliance/update");
        var content = new StringContent("{\r\n \"applianceId\": " + applianceId + ",\r\n \"type\": \"" +
        type + "\",\r\n \"powerUsage\": " + powerUsage + "\r\n}", null, "application/json");
        request.Content = content;
        var response = await client.SendAsync(request);
        return response.IsSuccessStatusCode;
    }

    public async Task<bool> DeleteAppliance(int id)
    {
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Delete, API_PORT + "/appliance/delete");
        var content = new StringContent("{\r\n \"applianceId\": " + id + "\r\n}", null, "application/json");
        request.Content = content;
        var response = await client.SendAsync(request);
        return response.IsSuccessStatusCode;
            
    }
}

public class otherDataClass {
    private string? API_PORT = Environment.GetEnvironmentVariable("API_PORT");
    private string mapboxAccessToken = "";
    public async Task<List<LocationSuggestion>> GetLocationSuggestions(string searchQuery)
    {     
        if(mapboxAccessToken == "") {
            await GetMapboxAccessToken();
        }

        string baseUrl = "https://api.mapbox.com/geocoding/v5/mapbox.places/";

        string requestUrl = $"{baseUrl}{searchQuery}.json?country=za&limit=5&proximity=ip&access_token={mapboxAccessToken}";

        try
        {
            HttpClient httpClient = new HttpClient();
            var mapResponse = await httpClient.GetFromJsonAsync<GeocodingResponse>(requestUrl);
            List<LocationSuggestion> suggestions = mapResponse?.Features ?? new List<LocationSuggestion>();
            if (suggestions.Count == 0)
            {
                suggestions.Add(new LocationSuggestion { Place_Name = "No results found" });
            }
            return suggestions;
        }
        catch (Exception ex)
        {
            // Handle any errors or exceptions
            Console.WriteLine(ex.Message);
            return new List<LocationSuggestion>();
        }
    }

    public async Task<string> GetLocationNameFromCoordinates(double latitude, double longitude)
    {
        if(mapboxAccessToken == "") {
            await GetMapboxAccessToken();
        }
        string baseUrl = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
        string requestUrl = $"{baseUrl}{longitude.ToString().Replace(",",".")},{latitude.ToString().Replace(",",".")}.json?&access_token={mapboxAccessToken}";

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

    private async Task GetMapboxAccessToken() {
        HttpClient httpClient = new HttpClient();
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Get, API_PORT + "/locationData/mapboxkey");
        var response = await client.SendAsync(request);
        if (response.StatusCode == System.Net.HttpStatusCode.OK){
            mapboxAccessToken = await response.Content.ReadAsStringAsync();
        }
        mapboxAccessToken = mapboxAccessToken.Trim('"');
    }

    public async Task<List<SystemUsage>?> GetAllAdminStats() {
        List<SystemUsage>? systems = null;
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Get, API_PORT + "/AdminStats/all");
        var response = await client.SendAsync(request);
        if (response.StatusCode == System.Net.HttpStatusCode.OK && response.Content != null)
        {
            var data = await response.Content.ReadAsStringAsync();
            if (data != null)
            {
                systems = JsonSerializer.Deserialize<List<SystemUsage>>(data, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                })!;
            }
        }
        else
        {
            Console.WriteLine("Failed to retrieve system usage");
        }
        return systems;
    }
    private class GeocodingResponse
    {
        public List<LocationSuggestion> Features { get; set; } = new List<LocationSuggestion>();
    }
}

public class keyClass {
    private string? API_PORT = Environment.GetEnvironmentVariable("API_PORT");
    public async Task<List<KeyModel>?> GetAllKeys()
    {
        List<KeyModel>? keys = null;
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Get, API_PORT + "/key/allBusiness");
        var response = await client.SendAsync(request);
        if (response.StatusCode == System.Net.HttpStatusCode.OK)
        {
            var data = await response.Content.ReadAsStringAsync();
            keys = JsonSerializer.Deserialize<List<KeyModel>>(data, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            })!;
        }
        else
        {
            Console.WriteLine("Failed");
        }
        return keys;
    }

    public async Task<bool> DeleteKey(int keyId) {
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Delete, API_PORT + "/key/delete");
        var content = new StringContent("{\r\n  \"keyId\": " + keyId +"\r\n}", null, "application/json");
        request.Content = content;
        var response = await client.SendAsync(request);
        return response.IsSuccessStatusCode;
    }

    public async Task<bool> UpdateKey(KeyModel key) {
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Patch, API_PORT + "/key/update");
        var content = new StringContent("{\r\n \"keyId\": " + key.keyId+ ",\r\n  \"owner\": \"" + key.owner+ "\",\r\n  \"APIKey\": \"" + key.APIKey + "\",\r\n  \"remainingCalls\": " + key.remainingCalls + ",\r\n  \"suspended\": " + key.suspended + " \r\n}", null, "application/json");
        request.Content = content;
        var response = await client.SendAsync(request);
        return response.IsSuccessStatusCode;
    }

    public async Task<bool> CreateKey(KeyModel key) {
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Post, API_PORT + "/key/create");
        var content = new StringContent("{\r\n  \"owner\": \"" + key.owner+ "\",\r\n  \"APIKey\": \"" + key.APIKey + "\",\r\n  \"remainingCalls\": " + key.remainingCalls + ",\r\n  \"suspended\": " + key.suspended + "\r\n}", null, "application/json");
        request.Content = content;
        var response = await client.SendAsync(request);
        return response.IsSuccessStatusCode;
    }
}

public class userClass {
    private string? API_PORT = Environment.GetEnvironmentVariable("API_PORT");

    public async Task<List<UserModel>?> getAllUsers() {
        List<UserModel>? users = null;
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Get, API_PORT + "/user/all");
        var response = await client.SendAsync(request);
        if (response.StatusCode == System.Net.HttpStatusCode.OK)
        {
            var data = await response.Content.ReadAsStringAsync();
            users = JsonSerializer.Deserialize<List<UserModel>>(data, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            })!;
        }
        return users;
    }

    public async Task<UserModel?> Login(string email, string password, string repassword) {
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Get, API_PORT + "/auth/login");
        var content = new StringContent("{\r\n    \"email\" : \"" + email + "\",\r\n    \"password\" : \"" + password+ "\",\r\n    \"repassword\" : \"" + repassword + "\"\r\n}", null, "application/json");
        request.Content = content;
        var response = await client.SendAsync(request);

        if(response.IsSuccessStatusCode){
            return await response.Content.ReadFromJsonAsync<UserModel>();        
        } else {
            Console.WriteLine("Failed to Login");
            Console.WriteLine(response.StatusCode);
        }
        return null;
    }

    public async Task<bool> Register(string email, string password, string repassword) {
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Post, API_PORT + "/auth/register");
        var content = new StringContent("{\r\n    \"email\" : \"" + email + "\",\r\n    \"password\" : \"" + password+ "\",\r\n    \"repassword\" : \"" + repassword + "\"\r\n}", null, "application/json");
        request.Content = content;
        var response = await client.SendAsync(request);

        return response.IsSuccessStatusCode;
    }
}

public class reportApplianceClass {
    string? API_PORT = Environment.GetEnvironmentVariable("API_PORT");
    public async Task CreateReportAppliance(int reportId, ApplianceModel appliance){
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Post, API_PORT + "/ReportAppliance/create");
        var content = new StringContent("{\r\n  \"reportId\": " + reportId + ",\r\n  \"applianceId\": " + appliance.applianceId + ",\r\n  \"numberOfAppliances\": " + appliance.quantity + "\r\n}", null, "application/json");
        request.Content = content;
        var response = await client.SendAsync(request);
        if(response.StatusCode != System.Net.HttpStatusCode.OK)
        {
            Console.WriteLine("Failed to create ReportAppliance - " + response.StatusCode);
        }
    }

    public async Task UpdateReportAppliance(int reportId, ApplianceModel appliance){
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Patch, API_PORT + "/ReportAppliance/updateNumberOfAppliances");
        var content = new StringContent("{\r\n  \"reportId\": " + reportId + ",\r\n  \"applianceId\": " + appliance.applianceId + ",\r\n  \"numberOfAppliances\": " + appliance.quantity + "\r\n}", null, "application/json");
        request.Content = content;
        var response = await client.SendAsync(request);
        if(response.StatusCode != System.Net.HttpStatusCode.OK)
        {
            Console.WriteLine("Failed to update ReportAppliance");
        }
    }
}

public class reportAllApplianceClass {
    string? API_PORT = Environment.GetEnvironmentVariable("API_PORT");

    public async Task<List<ReportAllApplianceModel>> GetReportAllAppliance()
    {
        List<ReportAllApplianceModel> allReportAllAppliance = new List<ReportAllApplianceModel>();
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Get, API_PORT + "/ReportAllAppliance/all");
        var response = await client.SendAsync(request);
        if (response.StatusCode == System.Net.HttpStatusCode.OK)
        {
            var data = await response.Content.ReadAsStringAsync();
            allReportAllAppliance = JsonSerializer.Deserialize<List<ReportAllApplianceModel>>(data, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            })!;
        }
        else
        {
            Console.WriteLine("Failed to get allReportAllAppliance");
        }
        return allReportAllAppliance;
    }
}