const { auth } = require('@google/earthengine');
const privateKey = require('../../../DO-NOT-COMMIT/blue-skies-387316-76add0413db1.json').private_key;
auth.authenticate({
  private_key: privateKey,
  client_email: 'blue-skies-get-data@blue-skies-387316.iam.gserviceaccount.com',
}, function (err, token) {
  if (err) {
    console.error('Authentication failed:', err);
  } else {
    console.log('Authentication succeeded!');
    // You can now make API requests using the Earth Engine API.
  }
});



/**
* Function to mask clouds using the Sentinel-2 QA band
* @param {ee.Image} image Sentinel-2 image
* @return {ee.Image} cloud masked Sentinel-2 image
*/
// Function to mask clouds using the Sentinel-2 QA band
function maskS2clouds(image) {
    var qa = image.select('QA60');
  
    // Bits 10 and 11 are clouds and cirrus, respectively.
    var cloudBitMask = 1 << 10;
    var cirrusBitMask = 1 << 11;
  
    // Both flags should be set to zero, indicating clear conditions.
    var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
      .and(qa.bitwiseAnd(cirrusBitMask).eq(0));
  
    return image.updateMask(mask).divide(10000);
  }
  
  // Load the South Africa boundary as a region of interest
  var southAfrica = ee.ImageCollection('COPERNICUS/S2_HARMONIZED');
    southAfrica.filter(ee.Filter.eq('country_na', 'South Africa'));
  
  // Map the function over a month of data and take the median.
  // Load Sentinel-2 TOA reflectance data (adjusted for processing changes
  // that occurred after 2022-01-25).
  
  var startDate = ee.Date('2019-01-01');
  var endDate = ee.Date('2019-01-31');
  var timeRange = ee.DateRange(startDate, endDate);
  var dataset = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
    .filterDate(timeRange)
    // Pre-filter to get less cloudy granules.
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 5))
    .map(maskS2clouds);
  
  var rgbVis = {
    min: 0.0,
    max: 0.3,
    bands: ['B4', 'B3', 'B2'],
  };
  
  Map.setCenter(30.0, -28.94, 6);
  Map.addLayer(dataset.median(), rgbVis, 'RGB');
  
  // // Generate random points within South Africa
  var numPoints = 0; // Adjust the number of points as needed
  var images = southAfrica.limit(numPoints);
  print('imgs', images);
  var randomPoints = ee.FeatureCollection.randomPoints(images.geometry(), numPoints);
  
  // // Display random points on the map
  Map.addLayer(randomPoints, { color: 'FF0000' }, 'Random Points');
  
  // Take a screenshot of the map
  var region = southAfrica.geometry();
  // Define the region of interest for the map screenshot
  var mapRegion = region.centroid().buffer(5000).bounds(); // Adjust the buffer size as needed
  
  // Set the visualization parameters for the map
  var mapVisParams = {
    bands: ['B4', 'B3', 'B2'],
    min: 0.0,
    max: 0.3
  };
  
  // Generate a map image
  var mapImage = ee.Image(dataset.median()).clip(mapRegion);
  
  // Add the map image to the map
  Map.addLayer(mapImage, mapVisParams, 'Map Image');
  
  // Export the map image to your Google Drive
  // Export.image.toDrive({
  //   image: mapImage,
  //   description: 'map_image',
  //   folder: 'GEE_outputs',
  //   fileNamePrefix: 'map_image',
  //   scale: 10, // Spatial resolution in meters
  //   region: mapRegion
  // });
  
  // Split the randomPoints feature collection into subsets of 1000 points
  // var subsets = randomPoints.toList(5000).map(function (list) {
  //   return ee.FeatureCollection(list);
  // });
  
  
  // var ds = ee.ImageCollection("COPERNICUS/S2_HARMONIZED");
  
  
  // var rp = ee.FeatureCollection.randomPoints(images.geometry(), 50);
  
  print('rp',randomPoints);
  
  var solarIrradianceB2 = randomPoints.map(function(feature) {
    var point = ee.Geometry.Point(feature.geometry().coordinates());
    var image = southAfrica.filterBounds(point).first();
    var percentage = image.get('SOLAR_IRRADIANCE_B2');
    return feature.set('solar_irradiance_b2', ee.Number(percentage));
  });
  
  
  
  var solarRad = solarIrradianceB2.aggregate_array('solar_irradiance_b2');
  // print('sa', southAfrica);
  print(solarIrradianceB2);
  print('sr', solarRad);
  
  
  
  
  
  
  // Convert the resulting collection to a list
  // var pointDataList = pointData.toList(pointData.size());
  
  // Print the data for each random point
  // for (var i = 0; i < pointDataList.size().getInfo(); i++) {
  //   var feature = ee.Feature(pointDataList.get(i));
  //   print("Feature: ", feature);
  //   //print('Point', i+1, 'Data:', feature.get('image_id'), feature.get('solar_irradiance'));
  // }
  // print("pointData:", pointData);
  
  
  
  
  // Save the solar irradiance data as a CSV file in your Google Drive within the "GEE_outputs" folder
  // Export.table.toDrive({
  //   collection: pointData,
  //   description: 'solar_irradiance_data',
  //   folder: 'GEE_outputs',
  //   fileFormat: 'CSV'
  // });
  
  