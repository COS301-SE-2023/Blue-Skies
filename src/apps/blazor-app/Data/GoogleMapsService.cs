using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

public class GoogleMapsService
{
    private readonly HttpClient _httpClient;
    private string apiKey = "";
    private string? API_PORT = Environment.GetEnvironmentVariable("API_PORT");

    public GoogleMapsService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<byte[]> GetStaticMapImageAsync(double longitude, double latitude, int zoom, int width, int height)
    {
        var request = new HttpRequestMessage(
            HttpMethod.Get,
            API_PORT + "/SolarScore/googlemapskey"
        );
        var response = await _httpClient.SendAsync(request);
        if (response.StatusCode == System.Net.HttpStatusCode.OK)
        {
            apiKey = await response.Content.ReadAsStringAsync();
        }
        apiKey = apiKey.Trim('"');

        Console.WriteLine($"Getting map image for {latitude}, {longitude}");
        var url =
            $"https://maps.googleapis.com/maps/api/staticmap?center={longitude},{latitude}&zoom={zoom}&size={width}x{height}&maptype=satellite&key={apiKey}";
        return await _httpClient.GetByteArrayAsync(url);
    }
}
