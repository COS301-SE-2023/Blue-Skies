using System;
using System.IO;
using OSGeo.GDAL;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;

namespace DataHandlers;

public class SolarDataHandler
{
    private SharedUtils.locationDataClass locationDataClass = new SharedUtils.locationDataClass();
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

public class RooftopDataHandler
{
    public string GetSatelliteImage(byte[] satteliteImageData)
    {
        if (satteliteImageData == null || satteliteImageData.Length == 0)
        {
            throw new ArgumentException("The provided image data is empty or null.");
        }

        try
        {
            using (var stream = new MemoryStream(satteliteImageData))
            {
                return ConvertToBase64(Image.Load<Rgba32>(stream));
            }
        }
        catch (Exception ex)
        {
            throw new Exception("Error loading image data.", ex);
        }
    }

    public string GetHeightMap(byte[] dsmData)
    {
        Gdal.AllRegister();

        if (dsmData == null || dsmData.Length == 0)
        {
            throw new ArgumentException("The provided DSM data is empty or null.");
        }

        // Create a temporary file to store the DSM data
        string dsmPath = Path.Combine(Path.GetTempPath(), "dsm.tif");
        File.WriteAllBytes(dsmPath, dsmData);

        // Open the temporary file as a GDAL dataset
        Dataset dsmDataset = Gdal.Open(dsmPath, Access.GA_ReadOnly);
        if (dsmDataset == null)
        {
            throw new ArgumentException("Failed to open DSM dataset.");
        }

        Band dsmBand = dsmDataset.GetRasterBand(1);

        int width = dsmBand.XSize;
        int height = dsmBand.YSize;

        float[] dsmValues = new float[width * height];
        dsmBand.ReadRaster(0, 0, width, height, dsmValues, width, height, 0, 0);

        float minElevation = float.MaxValue;
        float maxElevation = float.MinValue;

        for (int i = 0; i < dsmValues.Length; i++)
        {
            if (!float.IsNaN(dsmValues[i]))
            {
                minElevation = Math.Min(minElevation, dsmValues[i]);
                maxElevation = Math.Max(maxElevation, dsmValues[i]);
            }
        }

        // Create a new image
        var heightMap = new Image<Rgba32>(width, height);

        for (int y = 0; y < height; y++)
        {
            for (int x = 0; x < width; x++)
            {
                float elevation = dsmValues[y * width + x];
                if (!float.IsNaN(elevation))
                {
                    byte pixelValue = (byte)((elevation - minElevation) / (maxElevation - minElevation) * 255);
                    heightMap[x, y] = new Rgba32(pixelValue, pixelValue, pixelValue);
                }
            }
        }

        File.Delete(dsmPath);

        // Convert the heightMap image to base64
        using (var stream = new MemoryStream())
        {
            heightMap.SaveAsPng(stream);
            byte[] imageBytes = stream.ToArray();
            return Convert.ToBase64String(imageBytes);
        }
    }

    public string? GetAnnualFluxMap(byte[] fluxData, byte[] satteliteImageData, byte[] maskData)
    {
        Gdal.AllRegister();
        
        string fluxPath = Path.Combine(Path.GetTempPath(), "flux.tif");
        File.WriteAllBytes(fluxPath, fluxData);
        Dataset fluxDataSet = Gdal.Open(fluxPath, Access.GA_ReadOnly);

        string maskPath = Path.Combine(Path.GetTempPath(), "mask.tif");
        File.WriteAllBytes(maskPath, maskData);
        Dataset maskDataSet = Gdal.Open(maskPath, Access.GA_ReadOnly);

        if (fluxDataSet == null || fluxDataSet.RasterCount == 0)
        {
            throw new ArgumentException("Failed to open annual flux dataset.");
        }

        if (maskDataSet == null || maskDataSet.RasterCount == 0)
        {
            throw new ArgumentException("Failed to open mask dataset.");
        }

        if(satteliteImageData == null || satteliteImageData.Length == 0)
        {
            throw new ArgumentException("The provided image data is empty or null.");
        }

        Image<Rgba32> satelliteImage;

        try 
        {
            satelliteImage = Image.Load<Rgba32>(satteliteImageData);
        } 
        catch (Exception ex) 
        {
            throw new Exception("Error loading image data.", ex);
        }

        Band fluxBand = fluxDataSet.GetRasterBand(1);
        float[] fluxValues = new float[fluxBand.XSize * fluxBand.YSize];
        fluxBand.ReadRaster(0, 0, fluxBand.XSize, fluxBand.YSize, fluxValues, fluxBand.XSize, fluxBand.YSize, 0, 0);

        Band maskBand = maskDataSet.GetRasterBand(1);
        byte[] maskValues = new byte[maskBand.XSize * maskBand.YSize];
        maskBand.ReadRaster(0, 0, maskBand.XSize, maskBand.YSize, maskValues, maskBand.XSize, maskBand.YSize, 0, 0);


        // Extract the roof region based on the maskImage
        float[][] maskedData = new float[fluxBand.YSize][];
        byte[][] maskedMask = new byte[fluxBand.YSize][];
        for (int y = 0; y < fluxBand.YSize; y++)
        {
            maskedData[y] = new float[fluxBand.XSize];
            maskedMask[y] = new byte[fluxBand.XSize];
            for (int x = 0; x < fluxBand.XSize; x++)
            {
                int maskPixel = maskValues[y * maskBand.XSize + x];
                maskedData[y][x] = (maskPixel == 1) ? fluxValues[y * fluxBand.XSize + x] : float.NaN;
                maskedMask[y][x] = (maskPixel == 1) ? (byte)1 : (byte)0;
            }
        }

        // Calculate minData and maxData only for the roof region
        float minData = float.NaN;
        float maxData = float.NaN;

        foreach (float value in maskedData.SelectMany(row => row))
        {
            if (!float.IsNaN(value))
            {
                if (float.IsNaN(minData) || value < minData)
                    minData = value;
                if (float.IsNaN(maxData) || value > maxData)
                    maxData = value;
            }
        }

        File.Delete(fluxPath);
        File.Delete(maskPath);

        // Call the previously defined ConvertDataToYellowAndRedImage function
        return ConvertDataToYellowAndRedImage(maskedData, minData, maxData, satelliteImage, maskedMask, 3);
    }

    public string?[]? GetMonthlyFluxMap(byte[] monthlyFluxData, byte[] satteliteImageData, byte[] maskData) {
        Gdal.AllRegister();
        
        string montlyFluxPath = Path.Combine(Path.GetTempPath(), "monthlyFlux.tif");
        File.WriteAllBytes(montlyFluxPath, monthlyFluxData);
        Dataset monthlyFluxDataSet = Gdal.Open(montlyFluxPath, Access.GA_ReadOnly);

        string maskPath = Path.Combine(Path.GetTempPath(), "mask.tif");
        File.WriteAllBytes(maskPath, maskData);
        Dataset maskDataSet = Gdal.Open(maskPath, Access.GA_ReadOnly);
        
        if (monthlyFluxDataSet == null || monthlyFluxDataSet.RasterCount == 0)
        {
            throw new ArgumentException("Failed to open monthly flux dataset.");
        }

        if (maskDataSet == null || maskDataSet.RasterCount == 0)
        {
            throw new ArgumentException("Failed to open mask dataset.");
        }

        if(satteliteImageData == null || satteliteImageData.Length == 0)
        {
            throw new ArgumentException("The provided image data is empty or null.");
        }

        Image<Rgba32> satelliteImage;
        Image<Rgba32> resizedSatelliteImage;
        int ReinsizedX = 0;
        int ReinsizedY = 0;
        try 
        {
            satelliteImage = Image.Load<Rgba32>(satteliteImageData);
            resizedSatelliteImage = satelliteImage.CloneAs<Rgba32>();
            Band oneMonthFluxBand = monthlyFluxDataSet.GetRasterBand(1);
            ReinsizedX = oneMonthFluxBand.XSize;
            ReinsizedY = oneMonthFluxBand.YSize;
            resizedSatelliteImage.Mutate(ctx => ctx.Resize(new ResizeOptions
            {
                Size = new Size(oneMonthFluxBand.XSize, oneMonthFluxBand.YSize), // Set the desired size
                Sampler = KnownResamplers.Bicubic // Choose a resampling method
            }));
        } 
        catch (Exception ex) 
        {
            throw new Exception("Error loading image data.", ex);
        }

        Band maskBand = maskDataSet.GetRasterBand(1);
        byte[] maskValues = new byte[maskBand.XSize * maskBand.YSize];
        maskBand.ReadRaster(0, 0, maskBand.XSize, maskBand.YSize, maskValues, maskBand.XSize, maskBand.YSize, 0, 0);
        
        byte[][] maskValuesArray = new byte[satelliteImage.Width][];
        for (int y = 0; y < satelliteImage.Height; y++)
        {
            maskValuesArray[y] = new byte[satelliteImage.Width];
            for (int x = 0; x < satelliteImage.Width; x++)
            {
                int maskPixel = maskValues[y * maskBand.XSize + x];
                maskValuesArray[y][x] = (maskPixel == 1) ? (byte)1 : (byte)0;
            }
        }

        byte[][] resizedMaskValueArray = new byte[ReinsizedY][];
        for (int y = 0; y < ReinsizedY; y++)
        {
            resizedMaskValueArray[y] = new byte[ReinsizedX];
            for (int x = 0; x < ReinsizedX; x++)
            {
                // Calculate the corresponding position in the original array
                float originalX = (float)x / ReinsizedX * satelliteImage.Width;
                float originalY = (float)y / ReinsizedX * satelliteImage.Height;

                // Interpolate values from the original array
                byte value = Interpolate(maskValuesArray, originalX, originalY);

                // Assign the interpolated value to the resized array
                resizedMaskValueArray[y][x] = value;
            }
        }


        string?[] monthlyFluxImages = new string[12];

        float minData = float.NaN;
        float maxData = float.NaN;

        for(int i = 1; i <= 12; i++) {
            Band monthFluxBand = monthlyFluxDataSet.GetRasterBand(i);
            float[] monthlyFluxValues = new float[monthFluxBand.XSize * monthFluxBand.YSize];
            monthFluxBand.ReadRaster(0, 0, monthFluxBand.XSize, monthFluxBand.YSize, monthlyFluxValues, monthFluxBand.XSize, monthFluxBand.YSize, 0, 0);

            // Extract the roof region based on the maskImage
            float[][] maskedData = new float[monthFluxBand.YSize][];
            for (int y = 0; y < monthFluxBand.YSize; y++)
            {
                maskedData[y] = new float[monthFluxBand.XSize];
                for (int x = 0; x < monthFluxBand.XSize; x++)
                {
                    int maskPixel = resizedMaskValueArray[y][x];
                    maskedData[y][x] = (maskPixel == 1) ? monthlyFluxValues[y * monthFluxBand.XSize + x] : float.NaN;
                }
            }

            foreach (float value in maskedData.SelectMany(row => row))
            {
                if (!float.IsNaN(value))
                {
                    if (float.IsNaN(minData) || value < minData)
                        minData = value;
                    if (float.IsNaN(maxData) || value > maxData)
                        maxData = value;
                }
            }
        }

        for(int i = 1; i <= 12; i++) {
            Band monthFluxBand = monthlyFluxDataSet.GetRasterBand(i);
            float[] monthlyFluxValues = new float[monthFluxBand.XSize * monthFluxBand.YSize];
            monthFluxBand.ReadRaster(0, 0, monthFluxBand.XSize, monthFluxBand.YSize, monthlyFluxValues, monthFluxBand.XSize, monthFluxBand.YSize, 0, 0);

            // Extract the roof region based on the maskImage
            float[][] maskedData = new float[monthFluxBand.YSize][];
            for (int y = 0; y < monthFluxBand.YSize; y++)
            {
                maskedData[y] = new float[monthFluxBand.XSize];
                for (int x = 0; x < monthFluxBand.XSize; x++)
                {
                    int maskPixel = resizedMaskValueArray[y][x];
                    maskedData[y][x] = (maskPixel == 1) ? monthlyFluxValues[y * monthFluxBand.XSize + x] : float.NaN;
                }
            }

            monthlyFluxImages[i - 1] = ConvertDataToYellowAndRedImage(maskedData, minData, maxData, resizedSatelliteImage, resizedMaskValueArray, 2);
        }

        File.Delete(montlyFluxPath);
        File.Delete(maskPath);

        return monthlyFluxImages;
    }
    private string ConvertToBase64(Image<Rgba32> image)
    {
        using (var stream = new MemoryStream())
        {
            image.SaveAsPng(stream);
            return Convert.ToBase64String(stream.ToArray());
        }
    }

    private string? ConvertDataToYellowAndRedImage(float[][] maskedData, float minData, float maxData, Image<Rgba32> thisSatelliteImage, byte[][] maskValues, int power = 3)
    {
        (byte R, byte G, byte B) nanColor = (0, 0, 0);

        // Normalize the annual flux data to the [0, 1] range using minData and maxData from the roof
        float[][] normalizedData = maskedData.Select(row => row.Select(value => (value - minData) / (maxData - minData)).ToArray()).ToArray();

        // Apply a non-linear mapping to the normalized data
        normalizedData = normalizedData.Select(row => row.Select(value => (float)Math.Pow(value, power)).ToArray()).ToArray();

        // Create a custom colormap that maps the lowest quarter to yellow, the highest quarter to red,
        // and the middle half to transition colors
        Rgba32[] colormap = CreateColormap();
        
        // Apply the colormap to the normalized data
        Image<Rgba32> heatmapImage = ApplyColormap(normalizedData, colormap);

        // Handle NaN values by assigning nanColor
        for (int y = 0; y < heatmapImage.Height; y++)
        {
            for (int x = 0; x < heatmapImage.Width; x++)
            {
                if (float.IsNaN(maskedData[y][x]))
                {
                    heatmapImage[x, y] = new Rgba32(nanColor.R, nanColor.G, nanColor.B);
                }
            }
        }

        // Apply the colored flux to the roof region in the satellite image
        for (int y = 0; y < thisSatelliteImage.Height; y++)
        {
            for (int x = 0; x < thisSatelliteImage.Width; x++)
            {
                int maskPixel = maskValues[y][x];
                if (maskPixel == 1)
                {
                    Rgba32 heatmapPixel = heatmapImage[x, y];
                    thisSatelliteImage[x, y] = heatmapPixel;
                }
            }
        }

        // Convert the modified satellite image to a byte array and then to base64
        return ConvertToBase64(thisSatelliteImage);
    }

    private Rgba32[] CreateColormap()
    {
        // Create a custom colormap that smoothly transitions from yellow to red
        Rgba32[] colormap = new Rgba32[256];

        for (int i = 0; i < 256; i++)
        {
            int red = 255;
            int green = 255 - i; // Decrease green component as the value increases
            int blue = 0;
            colormap[i] = new Rgba32((byte)red, (byte)green, (byte)blue);
        }

        return colormap;
    }

    private Image<Rgba32> ApplyColormap(float[][] data, Rgba32[] colormap)
    {
        int width = data[0].Length;
        int height = data.Length;

        Image<Rgba32> heatmapImage = new Image<Rgba32>(width, height);

        for (int y = 0; y < height; y++)
        {
            for (int x = 0; x < width; x++)
            {
                float value = data[y][x];
                int colorIndex = (int)(value * 255);
                colorIndex = Math.Min(Math.Max(colorIndex, 0), 255); // Ensure it's within the valid range
                heatmapImage[x, y] = colormap[colorIndex];
            }
        }

        return heatmapImage;
    }

    private byte Interpolate(byte[][] array, float x, float y)
    {
        int x0 = (int)Math.Floor(x);
        int x1 = (int)Math.Ceiling(x);
        int y0 = (int)Math.Floor(y);
        int y1 = (int)Math.Ceiling(y);

        if (x0 < 0) x0 = 0;
        if (x1 >= array[0].Length) x1 = array[0].Length - 1;
        if (y0 < 0) y0 = 0;
        if (y1 >= array.Length) y1 = array.Length - 1;

        float tx = x - x0;
        float ty = y - y0;

        byte value00 = array[y0][x0];
        byte value01 = array[y0][x1];
        byte value10 = array[y1][x0];
        byte value11 = array[y1][x1];

        // Bilinear interpolation
        float interpolatedValue = (1 - tx) * (1 - ty) * value00 +
                                tx * (1 - ty) * value01 +
                                (1 - tx) * ty * value10 +
                                tx * ty * value11;

        return (byte)interpolatedValue;
    }
}