using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.ML;
using System.IO;


namespace GetSolarIrradiationFromImage
{
  internal class GetSolarIrradiationFromImage
  {
    private readonly MLContext mlContext;
    private readonly ITransformer trainedModel;

    public GetSolarIrradiationFromImage(string modelPath)
    {
      mlContext = new MLContext();
      trainedModel = LoadModel(modelPath);
    }

    private ITransformer LoadModel(string modelPath)
    {
      using (var stream = new FileStream(modelPath, FileMode.Open, FileAccess.Read, FileShare.Read))
      {
        return mlContext.Model.Load(stream, out _);
      }
    }

    //public string ClassifyImage(string imagePath)
    //{
      //var imageData = new ModelInput { ImagePath = imagePath };
      //var predictionEngine = mlContext.Model.CreatePredictionEngine<ModelInput, ModelOutput>(trainedModel);
      //var prediction = predictionEngine.Predict(imageData);

     // return prediction.PredictedLabel;
    //}
  }
}
