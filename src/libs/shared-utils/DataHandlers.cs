namespace DataHandler;

using System;
using System.Text.Json;


public class SolarCalculatorHandler
{
    private SharedUtils.locationDataClass locationDataClass = new SharedUtils.locationDataClass();
    private double perfectSolarIrradiation = 205;
    private double worstSolarIrradiation = 120;

    public LocationDataModel? locationData { get; set; }
    public int previousScore { get; set; } = -1;
    public int timesNotUpdated { get; set; } = 0;
    public int remainingCalls { get; set; } = 100;
    public int previousRemainingCalls { get; set; } = 100;

    private string? API_PORT = Environment.GetEnvironmentVariable("API_PORT");

    public async Task<int> GetSolarScoreFromData(
        double latitude,
        double longitude,
        double tempSolarIrradiation
    )
    {
        int result = getSolarScoreFromInitialData(tempSolarIrradiation);
        var locationData = await locationDataClass.GetLocationDataNoImage(latitude, longitude);

        if (locationData != null && locationData.data != null) {
            remainingCalls = locationData.remainingCalls;
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


