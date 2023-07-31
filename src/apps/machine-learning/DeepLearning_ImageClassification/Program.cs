using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using Microsoft.ML;
using static Microsoft.ML.DataOperationsCatalog;
using Microsoft.ML.Vision;

namespace DeepLearning_ImageClassification
{
    class Program
    {
        static void Main(string[] args)
        {
            var projectDirectory = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "../../../../../../src/apps/machine-learning/DeepLearning_ImageClassification"));
            string path = Path.Combine(projectDirectory, "assets/Average/-33.451-18.734-2022_02_14-184.23431646311923.png");
            Console.WriteLine(Predict(path));
        }

        public static string Predict(string imageFilePath)
        {
            var projectDirectory = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "../../../../../../src/apps/machine-learning/DeepLearning_ImageClassification"));
            var assetsRelativePath = Path.Combine(projectDirectory, "assets");
            var workspaceRelativePath = Path.Combine(projectDirectory, "workspace");

            MLContext mlContext = new MLContext();

            // Load the model
            DataViewSchema modelSchema;
            ITransformer trainedModel = mlContext.Model.Load("model.zip", out modelSchema);

            // Preprocess the input image
            IEnumerable<ImageData> images = LoadSingleImage(imageFilePath, assetsRelativePath);
            IDataView imageData = mlContext.Data.LoadFromEnumerable(images);
            IDataView preProcessedData = mlContext.Transforms.Conversion.MapValueToKey(inputColumnName: "Label", outputColumnName: "LabelAsKey")
                                .Append(mlContext.Transforms.LoadRawImageBytes(outputColumnName: "Image", imageFolder: assetsRelativePath, inputColumnName: "ImagePath"))
                                .Fit(imageData)
                                .Transform(imageData);

            // Make predictions
            var predictionEngine = mlContext.Model.CreatePredictionEngine<ModelInput, ModelOutput>(trainedModel);
            ModelInput image = mlContext.Data.CreateEnumerable<ModelInput>(preProcessedData, reuseRowObject: true).First();
            Console.WriteLine("LabelAsKey: " + image.LabelAsKey);
            Console.WriteLine("ImagePath: " + image.ImagePath);
            Console.WriteLine("Label: " + image.Label);
            //Console.WriteLine("Image: " + image.Image.ToString());
            ModelOutput prediction = predictionEngine.Predict(image);

            return prediction.PredictedLabel;
        }

        private static IEnumerable<ImageData> LoadSingleImage(string imageFilePath, string assetsRelativePath)
        {
            if (!File.Exists(imageFilePath))
            {
                Console.WriteLine("Image file not found.");
                yield break; // Use yield break to end the iteration without returning any value.
            }

            // We will use the filename as a dummy label since the actual label is not available.
            string label = Path.GetFileName(imageFilePath);
            string imagePathRelativeToAssets = Path.GetRelativePath(assetsRelativePath, imageFilePath);

            yield return new ImageData()
            {
                ImagePath = imagePathRelativeToAssets,
                Label = label
            };
        }


        public static void TestModel()
        {
            var projectDirectory = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "../../../../../../src/apps/machine-learning/DeepLearning_ImageClassification"));
            var assetsRelativePath = Path.Combine(projectDirectory, "assets");
            MLContext mlContext = new MLContext();

            IEnumerable<ImageData> images = LoadImagesFromDirectory(folder: assetsRelativePath, useFolderNameAsLabel: true);
            IDataView imageData = mlContext.Data.LoadFromEnumerable(images);


            Console.WriteLine("Shuffling data");
            IDataView shuffledData = mlContext.Data.ShuffleRows(imageData);


            var preprocessingPipeline = mlContext.Transforms.Conversion.MapValueToKey(
                    inputColumnName: "Label",
                    outputColumnName: "LabelAsKey")
                .Append(mlContext.Transforms.LoadRawImageBytes(
                    outputColumnName: "Image",
                    imageFolder: assetsRelativePath,
                    inputColumnName: "ImagePath"));

            Console.WriteLine("Preprocessing data");
            IDataView preProcessedData = preprocessingPipeline
                                .Fit(shuffledData)
                                .Transform(shuffledData);

            Console.WriteLine("Splitting the data data");
            TrainTestData trainSplit = mlContext.Data.TrainTestSplit(data: preProcessedData, testFraction: 0.3);
            TrainTestData validationTestSplit = mlContext.Data.TrainTestSplit(trainSplit.TestSet);

            IDataView testSet = validationTestSplit.TestSet;

            Console.WriteLine("Loading saved model");
            DataViewSchema modelSchema;
            ITransformer savedTrainedModel = mlContext.Model.Load("model.zip", out modelSchema);

            Console.WriteLine("Classifying images with loaded model");
            ClassifySingleImage(mlContext, testSet, savedTrainedModel);

            ClassifyImages(mlContext, testSet, savedTrainedModel);

            Console.WriteLine("Done Classifying Images");

            Console.ReadKey();
        }

        public static void TrainModel()
        {
            Console.WriteLine("Our project Directory:");
            var projectDirectory = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "../../../../../../src/apps/machine-learning/DeepLearning_ImageClassification"));
            Console.WriteLine(projectDirectory);
            var workspaceRelativePath = Path.Combine(projectDirectory, "workspace");
            var assetsRelativePath = Path.Combine(projectDirectory, "assets");

            MLContext mlContext = new MLContext();

            Console.WriteLine("Loading Images");
            IEnumerable<ImageData> images = LoadImagesFromDirectory(folder: assetsRelativePath, useFolderNameAsLabel: true);

            IDataView imageData = mlContext.Data.LoadFromEnumerable(images);

            Console.WriteLine("Shuffling data");
            IDataView shuffledData = mlContext.Data.ShuffleRows(imageData);

            var preprocessingPipeline = mlContext.Transforms.Conversion.MapValueToKey(
                    inputColumnName: "Label",
                    outputColumnName: "LabelAsKey")
                .Append(mlContext.Transforms.LoadRawImageBytes(
                    outputColumnName: "Image",
                    imageFolder: assetsRelativePath,
                    inputColumnName: "ImagePath"));

            Console.WriteLine("Preprocessing data");
            IDataView preProcessedData = preprocessingPipeline
                                .Fit(shuffledData)
                                .Transform(shuffledData);

            Console.WriteLine("Splitting the data data");
            TrainTestData trainSplit = mlContext.Data.TrainTestSplit(data: preProcessedData, testFraction: 0.3);
            TrainTestData validationTestSplit = mlContext.Data.TrainTestSplit(trainSplit.TestSet);

            IDataView trainSet = trainSplit.TrainSet;
            IDataView validationSet = validationTestSplit.TrainSet;
            IDataView testSet = validationTestSplit.TestSet;

            var classifierOptions = new ImageClassificationTrainer.Options()
            {
                FeatureColumnName = "Image",
                LabelColumnName = "LabelAsKey",
                ValidationSet = validationSet,
                ValidationSetBottleneckCachedValuesFileName = Path.Combine(workspaceRelativePath, "validationSetBottleneckFile.csv"),
                TrainSetBottleneckCachedValuesFileName = Path.Combine(workspaceRelativePath, "trainSetBottleneckFile.csv"),
                Arch = ImageClassificationTrainer.Architecture.InceptionV3,
                MetricsCallback = (metrics) => Console.WriteLine(metrics),
                WorkspacePath = workspaceRelativePath,
                FinalModelPrefix = Path.Combine(workspaceRelativePath, "model"),
                EarlyStoppingCriteria = null,
                TestOnTrainSet = false,
                ReuseTrainSetBottleneckCachedValues = true,
                ReuseValidationSetBottleneckCachedValues = true,
                Epoch = 200,
                LearningRate = 0.05f,
                BatchSize = 50
            };

            Console.WriteLine("Setting up the training pipeline");
            var trainingPipeline = mlContext.MulticlassClassification.Trainers.ImageClassification(classifierOptions)
                .Append(mlContext.Transforms.Conversion.MapKeyToValue("PredictedLabel"));

            Console.WriteLine("Training the model");
            ITransformer trainedModel = trainingPipeline.Fit(trainSet);

            Console.WriteLine("Saving model");
            Console.WriteLine("Model will be saved to: " + Path.Combine(workspaceRelativePath, "model.zip"));
            mlContext.Model.Save(trainedModel, imageData.Schema, "model.zip");

            Console.ReadKey();
        }

        public static void ClassifySingleImage(MLContext mlContext, IDataView data, ITransformer trainedModel)
        {
            PredictionEngine<ModelInput, ModelOutput> predictionEngine = mlContext.Model.CreatePredictionEngine<ModelInput, ModelOutput>(trainedModel);

            ModelInput image = mlContext.Data.CreateEnumerable<ModelInput>(data, reuseRowObject: true).First();
            ModelOutput prediction = predictionEngine.Predict(image);

            Console.WriteLine("Classifying single image");
            OutputPrediction(prediction);
        }

        public static void ClassifyImages(MLContext mlContext, IDataView data, ITransformer trainedModel)
        {
            IDataView predictionData = trainedModel.Transform(data);

            IEnumerable<ModelOutput> predictions = mlContext.Data.CreateEnumerable<ModelOutput>(predictionData, reuseRowObject: true).Take(10);

            Console.WriteLine("Classifying multiple images");
            foreach (var prediction in predictions)
            {
                OutputPrediction(prediction);
            }
        }

        private static void OutputPrediction(ModelOutput prediction)
        {
            string imageName = Path.GetFileName(prediction.ImagePath);
            Console.WriteLine($"Image: {imageName} | Actual Value: {prediction.Label} | Predicted Value: {prediction.PredictedLabel}");
        }

        public static IEnumerable<ImageData> LoadImagesFromDirectory(string folder, bool useFolderNameAsLabel = true)
        {
            var files = Directory.GetFiles(folder, "*",
                searchOption: SearchOption.AllDirectories);

            foreach (var file in files)
            {
                if ((Path.GetExtension(file) != ".jpg") && (Path.GetExtension(file) != ".png"))
                    continue;

                var label = Path.GetFileName(file);

                if (useFolderNameAsLabel)
                    label = Directory.GetParent(file).Name;
                else
                {
                    for (int index = 0; index < label.Length; index++)
                    {
                        if (!char.IsLetter(label[index]))
                        {
                            label = label.Substring(0, index);
                            break;
                        }
                    }
                }

                yield return new ImageData()
                {
                    ImagePath = file,
                    Label = label
                };
            }
        }
    }

    class ImageData
    {
        public string ImagePath { get; set; }

        public string Label { get; set; }
    }

    class ModelInput
    {
        public byte[] Image { get; set; }

        public UInt32 LabelAsKey { get; set; }

        public string ImagePath { get; set; }

        public string Label { get; set; }
    }

    class ModelOutput
    {
        public string ImagePath { get; set; }

        public string Label { get; set; }

        public string PredictedLabel { get; set; }
    }
}
