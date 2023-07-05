// This code takes the longitude and latitude of an image, and exports the image to Google Drive with the solar radiation value as the filename.

var folderName = "TestLab";
var scale = 10; // Resolution in meters

// Longitude and latitude variables
var latitude = -25.834295956575897;
var longitude = 28.29359305582216;


// Define the region of interest using coordinates (longitude, latitude pairs)
// Define the size of the region (width and height in degrees)
var width = 0.05;
var height = 0.05;

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

// Filter the image collection based on cloud coverage
var collection = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
  .filterBounds(roi)
  .filterDate('2016-06-01', '2016-06-29')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10));

// Get the first image in the collection
var image = ee.Image(collection.first());

function getSolarRadiation(image) {
  var solarRadiation = -1;
  if (image != null) {
    // Get the date of the specific image
    var date = image.date();

    // Filter the solar dataset to get the image with the closest date
    var solarDataSet = ee.ImageCollection('ECMWF/ERA5_LAND/DAILY_AGGR')
      .filterDate(date, date.advance(1, 'day')); // Filter the solar dataset for the specific date

    var solarImage = solarDataSet.first();

    // Clip the solar image to the region of interest
    var solarImageROI = solarImage.clip(roi);

    // Get the solar radiation band from the solar image
    var solarRadiationBand = solarImageROI.select('surface_net_solar_radiation_sum');

    // Calculate the mean solar radiation for the area
    var solarRadiationValue = solarRadiationBand.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: roi,
      scale: 10 // Resolution in meters
    }).get('surface_net_solar_radiation_sum');

    // Check if solar radiation value exists
    if (solarRadiationValue !== null) {
      solarRadiation = ee.Number(solarRadiationValue);
    }
  }
  
  return solarRadiation;
}

// Get the solar radiation for the specific image
var solarRadiation = getSolarRadiation(image);

// Get the solar radiation for the specific image
var solarRadiation = getSolarRadiation(image);

// Check if both solar radiation and an image exist
if (solarRadiation !== -1 && image) {
  // Format the date
  var dateFormatted = ee.Date(image.date()).format("YYYY_MM_dd");

  // Multiply solar radiation by 100 and convert to integer
  var solarRadiationNumber = ee.Number(solarRadiation).multiply(100).int();

  // Extract the integer and decimal parts of the solar radiation
  var integerPart = solarRadiationNumber.divide(100).int();
  var decimalPart = solarRadiationNumber.mod(100);

  // Concatenate the components for the description
  var description = ee.String(dateFormatted)
    .cat("_")
    .cat(integerPart)
    .cat("_")
    .cat(decimalPart);

  // Select the bands you want to export
  var bands = ['B4', 'B3', 'B2']; // Example bands, modify as per your requirement

  // Adjust visualization parameters
  var visParams = {
    bands: bands,
    min: 0.0, // Set the minimum value of the range
    max: 3000, // Set the maximum value of the range
  };

  // Apply visualization parameters to the image
  var visImage = image.select(bands).visualize(visParams);

  // Export the image to Google Drive
  Export.image.toDrive({
    image: visImage,
    description: description.getInfo(),
    folder: folderName,
    scale: scale,
    region: roi,
  });
} else {
  print('Error: Cannot export the image. Either solar radiation or image is missing.');
}