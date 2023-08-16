using System;
using System.Text.Json;

namespace BlazorApp.Data
{
    public class SolarCalculator
    {
        private double perfectSolarIrradiation = 220;

        public async Task<int[]> GetDataLocationData(
            double latitude,
            double longitude,
            string API_PORT,
            int solarScore,
            int remainingCalls
        )
        {
            System.Globalization.CultureInfo customCulture = (System.Globalization.CultureInfo)
            System.Threading.Thread.CurrentThread.CurrentCulture.Clone();
            customCulture.NumberFormat.NumberDecimalSeparator = ".";
            System.Threading.Thread.CurrentThread.CurrentCulture = customCulture;
            int[] result = { solarScore, remainingCalls };
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Get,
                API_PORT + "/locationData/getLocationDataWithoutImage/" + latitude + "/" + longitude
            );
            var response = await client.SendAsync(request);
            if (response.StatusCode == System.Net.HttpStatusCode.OK)
            {
                var data = await response.Content.ReadAsStringAsync();
                if (data.Equals("Solar Irradiation not found"))
                {
                    return result;
                }
                var locationData = JsonSerializer.Deserialize<LocationDataModel>(data);
                if (locationData == null || locationData.data == null)
                {
                    return result;
                }
                result[0] = calculateSolarScore(locationData.data);
                result[1] = locationData.remainingCalls;
                Console.WriteLine(
                    "Remaining calls: "
                        + remainingCalls
                        + " for call with latitude: "
                        + latitude
                        + " and longitude: "
                        + longitude
                );
            }
            else
            {
                Console.WriteLine("Failed to get data from LocationData");
            }
            return result;
        }

        private int calculateSolarScore(string data)
        {
            string input = data;
            double total = 0;
            int i = 0;
            while (input.Length > 0)
            {
                int newDataPointIndex = input.IndexOf(",");
                if (newDataPointIndex == -1)
                {
                    newDataPointIndex = input.Length;
                }
                string newDataPoint = input.Substring(0, newDataPointIndex);
                input = input.Substring(newDataPointIndex + 1);
                newDataPoint = newDataPoint.Trim();
                int solarScoreIndex = newDataPoint.IndexOf(";");
                total += Double.Parse(newDataPoint.Substring(solarScoreIndex + 1));
                i++;
            }
            double averageSolarIrradiation = total / i;
            double solarScore = averageSolarIrradiation / perfectSolarIrradiation * 100;
            if (solarScore > 100)
            {
                solarScore = 100;
            }
            return (int)solarScore;
        }
    }
}
