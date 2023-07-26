using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using Microsoft.ML;
using Microsoft.ML.Data;

namespace SolarRadiationPrediction
{
    class Program
    {
        static readonly string _dataPath = Path.Combine(Environment.CurrentDirectory, "Data", "solar_data.csv");

        static void Main(string[] args)
        {
            var projectDirectory = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "../../../../../../apps/machine-learning/Blue-Skies-ML/Blue-Skies-ML"));
            var assetsRelativePath = Path.Combine(projectDirectory, "assets");

            MLContext mlContext = new MLContext();

            IEnumerable<ImageData> images = LoadImagesFromDirectory(folder: assetsRelativePath);

            IDataView imageData = mlContext.Data.LoadFromEnumerable(images);

            // Extract date, longitude, and latitude from image paths and save to CSV
            SaveToCsv(mlContext, imageData);

            // Load data from CSV for training the regression model
            var data = mlContext.Data.LoadFromTextFile<ModelInput>(_dataPath, separatorChar: ',');

            // Define the data preprocessing pipeline
            var preprocessingPipeline = mlContext.Transforms.Conversion.MapValueToKey("Label", "SolarRadiation")
                .Append(mlContext.Transforms.Concatenate("Features", "Longitude", "Latitude", "Date"));

            // Train the regression model
            var regressionPipeline = preprocessingPipeline.Append(mlContext.Regression.Trainers.FastTree());
            var trainedModel = regressionPipeline.Fit(data);

            // Test the regression model
            var predictions = trainedModel.Transform(data);
            var metrics = mlContext.Regression.Evaluate(predictions);

            Console.WriteLine($"R2 Score: {metrics.RSquared}");
        }

        public static void SaveToCsv(MLContext mlContext, IDataView imageData)
        {
            using (StreamWriter writer = new StreamWriter(_dataPath))
            {
                writer.WriteLine("ImagePath,Longitude,Latitude,Date");

                foreach (var image in mlContext.Data.CreateEnumerable<ImageData>(imageData, reuseRowObject: true))
                {
                    string filename = Path.GetFileNameWithoutExtension(image.ImagePath);
                    string[] parts = filename.Split('-');
                    if (parts.Length != 4)
                    {
                        Console.WriteLine($"Invalid filename format: {filename}");
                        continue;
                    }

                    if (!float.TryParse(parts[0], NumberStyles.Float, CultureInfo.InvariantCulture, out float longitude) ||
                        !float.TryParse(parts[1], NumberStyles.Float, CultureInfo.InvariantCulture, out float latitude) ||
                        !DateTime.TryParseExact(parts[2], "yyyy_MM_dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime date))
                    {
                        Console.WriteLine($"Error parsing data from filename: {filename}");
                        continue;
                    }

                    writer.WriteLine($"{image.ImagePath},{longitude},{latitude},{date:yyyy_MM_dd}");
                }
            }

            Console.WriteLine("CSV file with solar data saved.");
        }

        public static IEnumerable<ImageData> LoadImagesFromDirectory(string folder)
        {
            var files = Directory.GetFiles(folder, "*", SearchOption.AllDirectories);

            foreach (var file in files)
            {
                if (!IsImageFile(file))
                    continue;

                yield return new ImageData()
                {
                    ImagePath = file
                };
            }
        }

        public static bool IsImageFile(string file)
        {
            var extension = Path.GetExtension(file).ToLower();
            return extension == ".jpg" || extension == ".jpeg" || extension == ".png";
        }
    }

    class ImageData
    {
        public string ImagePath { get; set; }
    }

    class ModelInput
    {
        public string ImagePath { get; set; }

        public float Longitude { get; set; }

        public float Latitude { get; set; }

        public DateTime Date { get; set; }
    }
}
