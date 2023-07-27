// using System;
// using System.Collections.Generic;
// using System.IO;
// using System.Linq;
// using Microsoft.ML;
// using Microsoft.ML.Data;

// namespace SolarRadiationPrediction
// {
//     class Program
//     {
//         private static ITransformer trainedModel;

//         static void Main(string[] args)
//         {
//             TrainAndTestModel();

//             // Load the pretrained model to generate the bottlenecks
//             var model = LoadPretrainedModel();

//             // Create the CSV file with the bottlenecks and additional data
//             CreateCsvFromBottlenecks(model);

//             // Train the model on the new CSV data
//             TrainModel();
//         }

//         public static void TrainAndTestModel()
//         {
//             var projectDirectory = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "../../../../../../apps/machine-learning/Blue-Skies-ML/Blue-Skies-ML"));
//             var workspaceRelativePath = Path.Combine(projectDirectory, "workspace");
//             var assetsRelativePath = Path.Combine(projectDirectory, "assets");

//             MLContext mlContext = new MLContext();

//             Console.WriteLine(projectDirectory);

//             IEnumerable<ImageData> images = LoadImagesFromDirectory(folder: assetsRelativePath, useFolderNameAsLabel: true);

//             IDataView imageData = mlContext.Data.LoadFromEnumerable(images);

//             IDataView shuffledData = mlContext.Data.ShuffleRows(imageData);

//             var preprocessingPipeline = mlContext.Transforms.Conversion.MapValueToKey(
//                 inputColumnName: "Label",
//                 outputColumnName: "LabelAsKey")
//             .Append(mlContext.Transforms.LoadRawImageBytes(
//                 outputColumnName: "Image",
//                 imageFolder: assetsRelativePath,
//                 inputColumnName: "ImagePath"));

//             IDataView preProcessedData = preprocessingPipeline
//                                         .Fit(shuffledData)
//                                         .Transform(shuffledData);

//             TrainTestData trainSplit = mlContext.Data.TrainTestSplit(data: preProcessedData, testFraction: 0.3);
//             TrainTestData validationTestSplit = mlContext.Data.TrainTestSplit(trainSplit.TestSet);

//             IDataView trainSet = trainSplit.TrainSet;
//             IDataView validationSet = validationTestSplit.TrainSet;
//             IDataView testSet = validationTestSplit.TestSet;

//             var classifierOptions = new ImageClassificationTrainer.Options()
//             {
//                 FeatureColumnName = "Image",
//                 LabelColumnName = "LabelAsKey",
//                 ValidationSet = validationSet,
//                 ValidationSetBottleneckCachedValuesFileName = Path.Combine(workspaceRelativePath, "validationSetBottleneckFile.csv"),
//                 TrainSetBottleneckCachedValuesFileName = Path.Combine(workspaceRelativePath, "trainSetBottleneckFile.csv"),
//                 Arch = ImageClassificationTrainer.Architecture.InceptionV3,
//                 MetricsCallback = (metrics) => Console.WriteLine(metrics),
//                 WorkspacePath = workspaceRelativePath,
//                 FinalModelPrefix = Path.Combine(workspaceRelativePath, "model"),
//                 EarlyStoppingCriteria = null,
//                 TestOnTrainSet = false,
//                 ReuseTrainSetBottleneckCachedValues = true,
//                 ReuseValidationSetBottleneckCachedValues = true,
//                 Epoch = 200,
//                 LearningRate = 0.05f,
//                 BatchSize = 50
//             };

//             var trainingPipeline = mlContext.MulticlassClassification.Trainers.ImageClassification(classifierOptions)
//                 .Append(mlContext.Transforms.Conversion.MapKeyToValue("PredictedLabel"));

//             ITransformer trainedModel = trainingPipeline.Fit(trainSet);

//             ClassifySingleImage(mlContext, testSet, trainedModel);

//             ClassifyImages(mlContext, testSet, trainedModel);

//             // Load the pretrained model to generate the bottlenecks
//             var model = LoadPretrainedModel();

//             // Create the CSV file with the bottlenecks and additional data
//             CreateCsvFromBottlenecks(model);

//             // Save the trained model to the field
//             trainedModel = trainingPipeline.Fit(data);
//         }

//             public static void ClassifySingleImage(MLContext mlContext, IDataView data, ITransformer trainedModel)
//         {
//             PredictionEngine<ModelInput, ModelOutput> predictionEngine = mlContext.Model.CreatePredictionEngine<ModelInput, ModelOutput>(trainedModel);

//             ModelInput image = mlContext.Data.CreateEnumerable<ModelInput>(data, reuseRowObject: true).First();

//             ModelOutput prediction = predictionEngine.Predict(image);

//             Console.WriteLine("Classifying single image");
//             OutputPrediction(prediction);
//         }

//         public static void ClassifyImages(MLContext mlContext, IDataView data, ITransformer trainedModel)
//         {
//             IDataView predictionData = trainedModel.Transform(data);

//             IEnumerable<ModelOutput> predictions = mlContext.Data.CreateEnumerable<ModelOutput>(predictionData, reuseRowObject: true).Take(10);

//             var correct = 0;
//             var error = new int[3];

//             Console.WriteLine("Classifying multiple images");
//             foreach (var prediction in predictions)
//             {
//                 OutputPrediction(prediction);
//                 if (prediction.Label == prediction.PredictedLabel)
//                     correct++;
//                 else
//                     error[getLabelIndex(prediction.Label)]++;
//             }
//             Console.WriteLine($"Correctly classified {correct} out of {predictions.Count()} images");
//             Console.WriteLine($"Bad: {error[0]}");
//             Console.WriteLine($"Average: {error[1]}");
//             Console.WriteLine($"Good: {error[2]}");
//         }

//         private static int getLabelIndex(string label)
//         {
//             switch (label)
//             {
//                 case "Bad":
//                     return 0;
//                 case "Average":
//                     return 1;
//                 case "Good":
//                     return 2;
//                 default:
//                     return -1;
//             }
//         }

//         private static void OutputPrediction(ModelOutput prediction)
//         {
//             string imageName = Path.GetFileName(prediction.ImagePath);
//             Console.WriteLine($"Image: {imageName} | Actual Value: {prediction.Label} | Predicted Value: {prediction.PredictedLabel}");
//         }

//         public static IEnumerable<ImageData> LoadImagesFromDirectory(string folder, bool useFolderNameAsLabel = true)
//         {
//             var files = Directory.GetFiles(folder, "*", searchOption: SearchOption.AllDirectories);

//             foreach (var file in files)
//             {
//                 if ((Path.GetExtension(file) != ".jpg") && (Path.GetExtension(file) != ".png"))
//                     continue;

//                 var label = Path.GetFileName(file);

//                 if (useFolderNameAsLabel)
//                     label = Directory.GetParent(file).Name;
//                 else
//                 {
//                     for (int index = 0; index < label.Length; index++)
//                     {
//                         if (!char.IsLetter(label[index]))
//                         {
//                             label = label.Substring(0, index);
//                             break;
//                         }
//                     }
//                 }

//                 yield return new ImageData()
//                 {
//                     ImagePath = file,
//                     Label = label
//                 };
//             }
//         }

//         private static ITransformer LoadPretrainedModel()
//         {
//             var projectDirectory = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "../../../../../../apps/machine-learning/Blue-Skies-ML/Blue-Skies-ML"));
//             var workspaceRelativePath = Path.Combine(projectDirectory, "workspace");
//             var assetsRelativePath = Path.Combine(projectDirectory, "assets");

//             MLContext mlContext = new MLContext();

//             var modelPath = Path.Combine(workspaceRelativePath, "model.zip");
//             var data = mlContext.Data.LoadFromTextFile<ModelInput>(modelPath, separatorChar: ',');

//             var pipeline = mlContext.Transforms.Conversion.MapValueToKey("Label", "LabelAsKey")
//                 .Append(mlContext.Transforms.LoadRawImageBytes("Image", assetsRelativePath, "ImagePath"))
//                 .Append(mlContext.Model.LoadTensorFlowModel(modelPath)
//                     .ScoreTensorName("dense_3/Softmax")
//                     .AddInput("conv2d_input", name => name == nameof(ModelInput.Image) ? true : false)
//                     .AddOutput("dense_3/Softmax")
//                     .AddInput("Placeholder", name => name == nameof(ModelInput.LabelAsKey) ? true : false)
//                     .AddOutput("dense_3/Softmax"))
//                 .Append(mlContext.Transforms.Conversion.MapKeyToValue("PredictedLabel", "PredictedLabel"))
//                 .Append(mlContext.Transforms.Conversion.MapKeyToValue("LabelAsKey", "Label"));

//             var model = pipeline.Fit(data);

//             return model;
//         }

//         private static void CreateCsvFromBottlenecks(ITransformer model)
//         {
//             var projectDirectory = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "../../../../../../apps/machine-learning/Blue-Skies-ML/Blue-Skies-ML"));
//             var assetsRelativePath = Path.Combine(projectDirectory, "assets");

//             MLContext mlContext = new MLContext();

//             var predictionData = model.Transform(data);

//             var predictions = mlContext.Data.CreateEnumerable<ModelOutput>(predictionData, reuseRowObject: true);

//             var csvPath = Path.Combine(projectDirectory, "solar_data.csv");

//             using (StreamWriter writer = new StreamWriter(csvPath))
//             {
//                 writer.WriteLine("Longitude,Latitude,Date");

//                 foreach (var prediction in predictions)
//                 {
//                     var imageName = Path.GetFileName(prediction.ImagePath);
//                     var coordinatesAndDate = imageName.Split('-');
//                     var longitude = coordinatesAndDate[0];
//                     var latitude = coordinatesAndDate[1];
//                     var date = coordinatesAndDate[2];
//                     writer.WriteLine($"{longitude},{latitude},{date}");
//                 }
//             }
//         }

//         private static void TrainModel()
//         {
//             var projectDirectory = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "../../../../../../apps/machine-learning/Blue-Skies-ML/Blue-Skies-ML"));
//             var workspaceRelativePath = Path.Combine(projectDirectory, "workspace");
//             var csvPath = Path.Combine(projectDirectory, "solar_data.csv");

//             MLContext mlContext = new MLContext();

//             var data = mlContext.Data.LoadFromTextFile<ModelInput>(csvPath, separatorChar: ',');

//             var featureColumnName = "Features";
//             var labelColumnName = "Label";

//             var dataProcessPipeline = mlContext.Transforms.Conversion.MapValueToKey(outputColumnName: labelColumnName, inputColumnName: "Label")
//                 .Append(mlContext.Transforms.Concatenate(featureColumnName, "Longitude", "Latitude"));

//             dataProcessPipeline = dataProcessPipeline.Append(mlContext.Transforms.Conversion.MapKeyToValue("Label", labelColumnName));

//             var trainer = mlContext.Regression.Trainers.LightGbm();

//             var trainingPipeline = dataProcessPipeline.Append(mlContext.Transforms.NormalizeMinMax(featureColumnName))
//                 .Append(trainer);

//             var trainedModel = trainingPipeline.Fit(data);
//         }
//     }

//     class ImageData
//     {
//         public string ImagePath { get; set; }

//         public string Label { get; set; }
//     }

//     class ModelInput
//     {
//         public byte[] Image { get; set; }

//         public UInt32 LabelAsKey { get; set; }

//         public string ImagePath { get; set; }

//         public string Label { get; set; }
//     }

//     class ModelOutput
//     {
//         public string ImagePath { get; set; }

//         public string Label { get; set; }

//         public string PredictedLabel { get; set; }
//     }
// }
