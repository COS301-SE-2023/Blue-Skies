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

            // Extract date, longitude, latitude, and solar radiation from image paths and save to CSV
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

            // Example prediction
            var predictionEngine = mlContext.Model.CreatePredictionEngine<ModelInput, ModelOutput>(trainedModel);
            var sampleData = new ModelInput
            {
                ImagePath = "sample_image.png",
                Longitude = 24.041f,
                Latitude = 29.837f,
                Date = new DateTime(2021, 08, 09)
            };
            var prediction = predictionEngine.Predict(sampleData);
            Console.WriteLine($"Predicted Solar Radiation: {prediction.SolarRadiation}");
        }

        public static void SaveToCsv(MLContext mlContext, IDataView imageData)
        {
            var directory = Path.GetDirectoryName(_dataPath);
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            using (StreamWriter writer = new StreamWriter(_dataPath))
            {
                writer.WriteLine("ImagePath,Longitude,Latitude,Date,SolarRadiation");

                foreach (var image in mlContext.Data.CreateEnumerable<ImageData>(imageData, reuseRowObject: true))
                {
                    // Parse the image file name to extract longitude, latitude, date, and solar radiation
                    var fileName = Path.GetFileNameWithoutExtension(image.ImagePath);
                    var parts = fileName.Split('-');

                    if (parts.Length >= 4)
                    {
                        var longitude = parts[0];
                        var latitude = parts[1];
                        var date = parts[2];
                        var solarRadiation = parts[3];

                        writer.WriteLine($"{image.ImagePath},{longitude},{latitude},{date},{solarRadiation}");
                    }
                    else
                    {
                        Console.WriteLine($"Invalid file name format: {image.ImagePath}");
                    }
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

        [LoadColumn(4)] // Target variable (solar radiation) is at column index 4 in the CSV file
        public float SolarRadiation { get; set; }
    }

    class ModelOutput
    {
        public float SolarRadiation { get; set; }
    }
}
