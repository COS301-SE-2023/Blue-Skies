using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

public class GoogleMapsService
{
    private readonly HttpClient _httpClient;
    private readonly string apiKey = "";

    public GoogleMapsService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<byte[]> GetStaticMapImageAsync(double latitude, double longitude, int zoom, int width, int height)
    {
        Console.WriteLine($"Getting map image for {latitude}, {longitude}");
        var url = $"https://maps.googleapis.com/maps/api/staticmap?center={longitude},{latitude}&zoom={zoom}&size={width}x{height}&maptype=satellite&markers=color:red|{latitude},{longitude}&key={apiKey}";
        return await _httpClient.GetByteArrayAsync(url);
    }
}
