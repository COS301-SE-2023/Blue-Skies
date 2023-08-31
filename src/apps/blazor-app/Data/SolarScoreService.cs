using System;
using System.Text.Json;

namespace BlazorApp.Data
{
    public class SolarCalculator
    {
        private double perfectSolarIrradiation = 205;
        private double worstSolarIrradiation = 120;

        public async Task<int[]> GetDataLocationData(
            double latitude,
            double longitude,
            string API_PORT,
            int remainingCalls,
            double tempSolarIrradiation,
            int previousScore
        )
        {
            System.Globalization.CultureInfo customCulture = (System.Globalization.CultureInfo)
            System.Threading.Thread.CurrentThread.CurrentCulture.Clone();
            customCulture.NumberFormat.NumberDecimalSeparator = ".";
            System.Threading.Thread.CurrentThread.CurrentCulture = customCulture;
            int[] result = { getPercentage(tempSolarIrradiation), remainingCalls };
            if(result [0] > 100) 
            {
                result[0] = 100;
            }
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Get,
                API_PORT + "/locationData/GetLocationDataWithoutImage/" + latitude + "/" + longitude
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
                result[1] = locationData.remainingCalls;
                if(locationData.remainingCalls >= 100)
                {
                    return result;
                }
                result[0] = calculateSolarScore(locationData.data);
            }
            else
            {
                if(previousScore != -1)
                {
                    result[0] = previousScore;
                }
                Console.WriteLine("Failed to get data from LocationData");
                Console.WriteLine("Previous score: " + previousScore);
            }
            return result;
        }

        private int calculateSolarScore(string data)
        {
            string input = data;
            decimal total = 0;
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
                total += decimal.Parse(newDataPoint.Substring(solarScoreIndex + 1));
                i++;
            }
            if(i == 0)
            {
                return 0;
            }
            decimal averageSolarIrradiation = total / i;
            double solarScore = getPercentage((double)averageSolarIrradiation);
            if (solarScore > 100)
            {
                solarScore = 100;
            }
            if(solarScore <= 0) {
                Random random = new Random();
                solarScore = random.Next(0, 15);
            }

            return (int)solarScore;
        }

        private int getPercentage(double solarIrradiation)
        {
            double difference = perfectSolarIrradiation - worstSolarIrradiation;
            double percentage = (solarIrradiation - worstSolarIrradiation) / difference * 100;
            if (percentage < 0)
            {
                percentage = 0;
            } else if (percentage > 100)
            {
                percentage = 100;
            }
            return (int)percentage;
        }
    }
}
