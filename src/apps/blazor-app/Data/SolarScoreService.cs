using System;
using System.Text.Json;

namespace BlazorApp.Data
{
    public class SolarCalculator
    {
        private double perfectSolarIrradiation = 205;
        private double worstSolarIrradiation = 120;

        public LocationDataModel? locationData { get; set; }
        public int previousScore { get; set; } = -1;
        public int timesNotUpdated { get; set; } = 0;
        public int remainingCalls { get; set; } = 100;
        public int previousRemainingCalls { get; set; } = 100;

        public async Task<int> GetSolarScoreFromData(
            double latitude,
            double longitude,
            string API_PORT,
            double tempSolarIrradiation
        )
        {
            System.Globalization.CultureInfo customCulture = (System.Globalization.CultureInfo)
            System.Threading.Thread.CurrentThread.CurrentCulture.Clone();
            customCulture.NumberFormat.NumberDecimalSeparator = ".";
            System.Threading.Thread.CurrentThread.CurrentCulture = customCulture;
            int result = getSolarScoreFromInitialData(tempSolarIrradiation);
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
                locationData = JsonSerializer.Deserialize<LocationDataModel>(data);
                if (locationData == null || locationData.data == null)
                {
                    return result;
                }
                remainingCalls = locationData.remainingCalls;
                Console.WriteLine("Remaining calls: " + remainingCalls + " vs " + previousRemainingCalls);
                if (previousRemainingCalls != remainingCalls)
                {
                    timesNotUpdated = 0;
                }
                else
                {
                    timesNotUpdated++;
                }
                previousRemainingCalls = remainingCalls;
                if (locationData.remainingCalls >= 100)
                {
                    return result;
                }
                result = calculateSolarScore(locationData.data);
            }
            else
            {
                if (previousScore != -1)
                {
                    result = previousScore;
                }
                Console.WriteLine("Failed to get data from LocationData");
                Console.WriteLine("Previous score: " + previousScore);
            }
            previousScore = result;
            return result;
        }

        public int calculateSolarScore(string data)
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
            if (i == 0)
            {
                return 0;
            }
            decimal averageSolarIrradiation = total / i;
            double solarScore = getPercentage((double)averageSolarIrradiation);
            if (solarScore > 100)
            {
                solarScore = 100;
            }
            if (solarScore <= 0)
            {
                solarScore = 4;
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
            }
            else if (percentage > 100)
            {
                percentage = 100;
            }
            return (int)percentage;
        }

        public void reset()
        {
            previousScore = -1;
            timesNotUpdated = 0;
            remainingCalls = 100;
            previousRemainingCalls = 100;
        }

        public int getSolarScoreFromInitialData(double tempSolarIrradiation)
        {
            var result = getPercentage(tempSolarIrradiation);
            if (result > 100)
            {
                result = 100;
            }
            return result;
        }

        public double getPowerSaved(double annualKWGenerated) {
            return annualKWGenerated * 10 / 1000;
        }

        public double getCO2Saved(double annualKWGenerated) {
            return getPowerSaved(annualKWGenerated) * 1.03 * 1000;
        }

        public double waterSaved(double annualKWGenerated) {
            return getPowerSaved(annualKWGenerated) * 1.45 * 1000;
        }

        public double coalNotBurnt(double annualKWGenerated) {
            return getPowerSaved(annualKWGenerated) * 0.56 * 1000;
        }

        public double treesPlanted(double annualKWGenerated) {
            return getPowerSaved(annualKWGenerated) * 0.01808;
        }
    }
}
