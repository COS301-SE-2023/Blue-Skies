//This code snippet generates random numbers and retrieves satellite images and satellite radiation information from Google Earth Engine based on the generated coordinates

var endYear = 2022;
var numYears = 3;
var numPoints = 3;
var folderName = "Training_Data";
var scale = 10;
var width = 0.05;
var height = 0.05;

// Function to calculate solar radiation
function getSolarRadiation(image, roi) 
{
  var solarRadiation = -1;
  if (image !== null) 
  {
    // Get the date of the specific image
    var date = image.date();

    // Filter the solar dataset to get the image with the closest date
    var solarDataSet = ee.ImageCollection('ECMWF/ERA5_LAND/DAILY_AGGR')
      .filterDate(date, date.advance(1, 'day')); // Filter the solar dataset for the specific dateApologies for the incomplete response. Here's the continuation of the code:

    var solarImage = solarDataSet.first();

    // Clip the solar image to the region of interest
    var solarImageROI = solarImage.clip(roi);

    // Get the solar radiation band from the solar image
    var solarRadiationBand = solarImageROI.select('surface_net_solar_radiation_sum');

    // Calculate the mean solar radiation for the area
    var solarRadiationValue = solarRadiationBand.reduceRegion(
    {
      reducer: ee.Reducer.mean(),
      geometry: roi,
      scale: scale // Resolution in meters
    }).get('surface_net_solar_radiation_sum');

    // Check if solar radiation value exists
    if (solarRadiationValue !== null) 
    {
      solarRadiation = ee.Number(solarRadiationValue);
    }
  }
  return solarRadiation;
}

// Generate a random 8-digit key
function generateRandomKey() 
{
  var key = '';
  for (var i = 0; i < 8; i++) 
  {
    key += Math.floor(Math.random() * 10);
  }
  return key;
}

// Iterate over each random point
var features = randomPoints.features;
features.forEach(function (feature) 
{
  // Generate a random key
  var randomKey = generateRandomKey();
  
  var point = ee.Feature(feature);

  // Get the point's coordinates
  var latitude = point.geometry().coordinates().get(1).getInfo();
  var longitude = point.geometry().coordinates().get(0).getInfo();

  // Calculate half of the width and height
  var halfWidth = width / 2;
  var halfHeight = height / 2;

  // Calculate the coordinates of the bounding box
  var lowerLeft = [longitude - halfWidth, latitude - halfHeight];
  var lowerRight = [longitude + halfWidth, latitude - halfHeight];
  var upperRight = [longitude + halfWidth, latitude + halfHeight];
  var upperLeft = [longitude - halfWidth, latitude + halfHeight];

  // Define the region of interest as a polygon
  var roi = ee.Geometry.Polygon([
    lowerLeft,
    lowerRight,
    upperRight,
    upperLeft,
  ]);
  
  for (var year = endYear - numYears + 1; year <= endYear; year++) 
  {
    for (var i = 1; i <= 12; i++) 
    {
      // Get dates
      var stringDateMonth = i < 10 ? '0' + i : i;
      var startDate = ee.Date(year + '-' + stringDateMonth + '-01');
      var endDate = ee.Date(year + '-' + stringDateMonth + '-28');
      var timeRange = ee.DateRange(startDate, endDate);

      // Filter the image collection based on cloud coverage
      var collection = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
        .filterBounds(roi)
        .filterDate(startDate, endDate)
        .sort('CLOUDY_PIXEL_PERCENTAGE')
        .limit(1); // Limit the collection to one image
      
      // Get the image from the collection
      var image = ee.Image(collection.first());

      // Get the solar radiation for the specific image
      var solarRadiation = getSolarRadiation(image, roi);

      // Check if both solar radiation and an image exist
      if (solarRadiation !== -1 && image.getInfo()) 
      {
        // Format the date
        var dateFormatted = ee.Date(image.date()).format("YYYY_MM_dd");

        // Multiply solar radiation by 100 and convert to integer
        var solarRadiationNumber = ee.Number(solarRadiation).multiply(100).int();

        // Extract the integer and decimal parts of the solar radiation
        var integerPart = solarRadiationNumber.divide(100).int();
        var decimalPart = solarRadiationNumber.mod(100);

        // Concatenate the random key, date, and components for the description
        var description = ee.String(randomKey)
          .cat("_")
          .cat(dateFormatted)
          .cat("_")
          .cat(integerPart)
          .cat("_")
          .cat(decimalPart).getInfo();

        print(description);

        // Select the bands you want to export
        var bands = ['B4', 'B3', 'B2']; // Example bands, modify as per your requirement

        // Adjustvisualization parameters
        var visParams = 
        {
          bands: bands,
          min: 0.0, // Set the minimum value of the range
          max: 3000, // Set the maximum value of the range
        };

        // Apply visualization parameters to the image
        var visImage = image.select(bands).visualize(visParams);

        // Export the image to Google Drive
        Export.image.toDrive(
        {
          image: visImage,
          description: description,
          folder: folderName,
          scale: scale,
          region: roi,
        });
      } 
      else 
      {
        print('Error: Cannot export the image. Either solar radiation or image is missing.');
      }
    }
  }
});
