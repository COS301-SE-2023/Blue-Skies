using System.Net;
using System;
using System.Text.Json;
using Newtonsoft.Json;
using System.Threading.Tasks.Dataflow;
using System.Collections.Concurrent;

namespace Api.Repository;

public class BusinessRequestDataRepository
{
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

    private async Task<bool> IsKeyValid(String key){
        var client = new HttpClient();
        //get and compare key with keys from db
        var keysRequest = new HttpRequestMessage(
            HttpMethod.Get,
            express + "/api/key/all"
        );
        var keysResponse = await client.SendAsync(keysRequest);

        if (keysResponse.IsSuccessStatusCode)
        {
            var responseContent = await keysResponse.Content.ReadAsStringAsync();

            var keysData = JsonConvert.DeserializeObject<List<Keys>>(responseContent);

            foreach (var keyData in keysData!)
            {
                if (keyData.APIKey == key)
                {
                    return true;
                }
            }

            return false;
        }
        else
        {
            // Handle unsuccessful response
            throw new Exception("Error fetching keys");
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
            
            if (!await IsKeyValid(key)){
                throw new Exception("Invalid API key");
            }
          
            //create data if not created yet

            var client = new HttpClient();
            var dataTypeResponse = new HttpResponseMessage();
           
            switch(data.ToLower()){
                case "solar score" : 
                    bool exists = await GetLocationData(latitude, longitude);
                    if (!exists)
                    {
                        await getInitialData(latitude, longitude);
                        byte[] imageBytes = new byte[0];
                        await CreateLocationData(latitude, longitude, (float)currentLocationData.daylightHours, Convert.ToBase64String(imageBytes));
                    }

                    var dataType = new HttpRequestMessage(
                        HttpMethod.Get, 
                        express + "/api/locationData/withoutImage/{" + longitude + "}/{" + latitude + "}"
                    );
                    dataTypeResponse = await client.SendAsync(dataType);

                    break;
                default : 
                    throw new Exception("Error: Not a valid option chosen for data type");
                    break;
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

    public async Task CreateLocationData(double latitude, double longitude, float daylightHours, string image) 
    {
        string  elevationData = await getElevationData(latitude, longitude);
        Console.WriteLine("Elevation data: " + elevationData);
        var numYears = 3;
        var numDaysPerYear = 48;
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Post, API_PORT + "/locationData/create");
        var content = new StringContent("{\r\n    \"latitude\": \"" 
                                    + latitude 
                                    + "\",\r\n    \"longitude\": \"" 
                                    + longitude 
                                    + "\",\r\n    \"daylightHours\" : \"" 
                                    + daylightHours 
                                    + "\",\r\n    \"image\": \"" 
                                    + image 
                                    + "\" ,\r\n    \"elevationData\": \"" 
                                    + elevationData +"\"\r\n}", null, "application/json");
        
        request.Content = content;
        var response = await client.SendAsync(request);
        if (response.IsSuccessStatusCode)
        {
            client = new HttpClient();
            request = new HttpRequestMessage(HttpMethod.Get, API_PORT + "/locationData/getSolarIrradiationData");
            content = new StringContent("{\r\n    \"latitude\": "+ latitude + ",\r\n    \"longitude\": " + longitude + ",\r\n    \"numYears\": "+ numYears + ",\r\n    \"numDaysPerYear\": "+ numDaysPerYear +"\r\n}", null, "application/json");
            request.Content = content;
            response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                Console.WriteLine("Successfully called python file");

            } else {
                Console.WriteLine("Failed to call python file");
            }
        } else {
            Console.WriteLine("Failed to create row table in database for solarIrradiation data");
        }
    } 


     private async Task<bool> GetLocationData(double latitude, double longitude){
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.Get, API_PORT + "/locationData/GetLocationData/" + latitude + "/" + longitude);
        var response = await client.SendAsync(request);
        if (response.IsSuccessStatusCode)
        {
            Console.WriteLine("Location data found");
            string data = response.Content.ReadAsStringAsync().Result;
            

            //currentLocationData = JsonSerializer.Deserialize<LocationDataModel>(data);
            return true;
        } else {
            Console.WriteLine("Location data not found - fetching data instead");
            return false;
        }
    }

    private async Task<string> getElevationData(double latitude, double longitude) {
        ElevationApiRequests apiRequests = new ElevationApiRequests();
        Elevations elevations = new Elevations();
        int MIN = -25;
        int MAX = 25;
        string url = "https://api.open-meteo.com/v1/elevation";

        for (int i = MIN; i <= MAX; i++)
        {
            double newLongitude = longitude - (i * 0.000897);
            apiRequests.Set(i, $"{url}?latitude={latitude}&longitude={newLongitude}");
        }

        var dataflowBlock = new ActionBlock<int>(
            async id =>
            {
                await apiRequests.CallApiAsync(id, elevations);
            },
            new ExecutionDataflowBlockOptions
            {
                MaxDegreeOfParallelism = 10
            });

        for (int i = MIN; i <= MAX; i++)
        {
            dataflowBlock.Post(i);
        }

        dataflowBlock.Complete();
        await dataflowBlock.Completion;
        string result = "";
        for (int i = MIN; i <= MAX; i++)
        {
            result += elevations.Get(i) + ",";
        }
        return result;
    }

   class ElevationApiRequests
    {
        private readonly Dictionary<int, string> data = new Dictionary<int, string>();
        private readonly HttpClient httpClient = new HttpClient();

        public void Set(int id, string url)
        {
            data[id] = url;
        }

        public async Task CallApiAsync(int id, Elevations elevations)
        {
            string? apiUrl;
            if (data.TryGetValue(id, out apiUrl) && apiUrl != null)
            {
                HttpResponseMessage response = await httpClient.GetAsync(apiUrl);
                response.EnsureSuccessStatusCode();
                string responseBody = await response.Content.ReadAsStringAsync();
                var responseData = Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(responseBody);
                
                if (responseData.elevation != null && responseData.elevation.HasValues)
                {
                    double elevationValue = (double)responseData.elevation[0];
                    elevations.Set(id, elevationValue);
                }
            }
        }   
    }
    class Elevations
    {
        private readonly ConcurrentDictionary<int, double> data = new ConcurrentDictionary<int, double>();

        public void Set(int id, double elevation)
        {
            data[id] = elevation;
        }

        public double Get(int id)
        {
            if (data.TryGetValue(id, out double elevation))
            {
                return elevation;
            }
            return 0.0; // You may want to handle this case differently
        }
    }
        public async Task getInitialData(double latitude, double longitude)
    {
        var data = new List<WeatherData>();
        var client = new HttpClient();
        var apiKey = Environment.GetEnvironmentVariable("VISUAL_CROSSING_WEATHER_API_KEY");
        var apiUrl = $"https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/{latitude},{longitude}?unitGroup=metric&include=days&key={apiKey}&elements=sunrise,sunset,temp,solarenergy,solarradiation,datetime";
        data.Add(await FetchWeatherDataAsync(client, apiUrl));
        
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
            apiUrl = $"https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/{latitude},{longitude}/{year}-{monthString}-15/{year}-{monthString}-15?unitGroup=metric&include=days&key={apiKey}&elements=sunrise,sunset,temp,solarenergy,solarradiation,datetime";

            // Asynchronously fetch the data and add the task to the list
            tasks.Add(FetchWeatherDataAsync(client, apiUrl));
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

        var averageSunlightHours = 0f;
        var averageSolarIrradiation = 0.0;
        for(var i = 0; i < data.Count; i++) {
            if(data[i] == null || data[i].days == null) {
                Console.WriteLine("Data is null");
                continue;
            }

            var averageSolarIrradiationMonth = 0.0;
            var monthSunlightHours = 0f;

            #pragma warning disable CS8602
            for(var j = 0; j < data[i].days.Count; j++) {
                var sunrise = data[i].days[j].sunrise;
                var sunset = data[i].days[j].sunset;
                var sunriseSplit = sunrise.Split(":");
                var sunsetSplit = sunset.Split(":");
                var sunriseTotalHours =  float.Parse(sunriseSplit[0]) + (float.Parse(sunriseSplit[1]) / 60);
                var sunsetTotalHours = float.Parse(sunsetSplit[0]) + (float.Parse(sunsetSplit[1]) / 60);
                var daylightHours = sunsetTotalHours - sunriseTotalHours;
                monthSunlightHours += daylightHours;

                averageSolarIrradiationMonth += data[i].days[j].solarradiation;
            }
            monthSunlightHours = monthSunlightHours / data[i].days.Count;
            averageSunlightHours += monthSunlightHours;

            averageSolarIrradiationMonth = averageSolarIrradiationMonth / data[i].days.Count;
            averageSolarIrradiation += averageSolarIrradiationMonth;
        }
        averageSunlightHours = averageSunlightHours / data.Count;
        averageSunlightHours = (float)Math.Round(averageSunlightHours, 2);
        averageSolarIrradiation = averageSolarIrradiation / data.Count;

        // currentLocationData.daylightHours = averageSunlightHours;
    }

    private async Task<WeatherData> FetchWeatherDataAsync(HttpClient client, string apiUrl)
    {
        try
        {
            var response = await client.GetAsync(apiUrl);
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync();
                if (result != null && result.Length > 0 && result[0] == '{')
                {
                    return System.Text.Json.JsonSerializer.Deserialize<WeatherData>(result);
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