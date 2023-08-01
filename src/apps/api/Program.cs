using Microsoft.ML.Data;
using Microsoft.Extensions.ML;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddPredictionEnginePool<ModelInput, ModelOutput>()
    .FromFile(modelName: "DeepLearning_ImageClassification", filePath: "model.zip", watchForChanges: true);
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
app.MapGet("/", () => "Welcome to the Blue-Skies API!");
// var predictionHandler =
//     async (PredictionEnginePool<ModelInput, ModelOutput> predictionEnginePool, ModelInput input) =>
//         await Task.FromResult(predictionEnginePool.Predict(modelName: "DeepLearning_ImageClassification", input));

// app.MapPost("/predict", predictionHandler);
app.Run();

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
