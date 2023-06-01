/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var ds = ee.ImageCollection("COPERNICUS/S2_HARMONIZED"),
    imageCollection = ee.ImageCollection("ECMWF/ERA5_LAND/DAILY_AGGR"),
    imageCollection2 = ee.ImageCollection("COPERNICUS/S2_HARMONIZED");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// Function to mask clouds using the Sentinel-2 QA band
function maskS2clouds(image) {
  var qa = image.select('QA60');

  // Bits 10 and 11 are clouds and cirrus, respectively.
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;

  // Both flags should be set to zero, indicating clear condi\tions.
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
    .and(qa.bitwiseAnd(cirrusBitMask).eq(0));

  return image.updateMask(mask).divide(10000);
}


//get dates
var startDate = ee.Date('2020-06-01');
var endDate = ee.Date('2020-06-30');
var timeRange = ee.DateRange(startDate, endDate);

var sa = ee.FeatureCollection('FAO/GAUL/2015/level0')
  .filter(ee.Filter.eq('ADM0_NAME', 'South Africa'));

print('sa.limit(x)', sa.limit(10));
print('sa boundary', sa.geometry());


var region = ee.ImageCollection('ECMWF/ERA5_LAND/DAILY_AGGR')
  .filterDate(timeRange)
  .filterBounds(sa.geometry());

print('Region.limit(x)', region.limit(10));
print('Region.first()', region.first()); //band: surface_net_solar_radiation_sum


//get sattelite images for < 5% cloud coverage 
var cloudImageCollection = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
  .filterDate(timeRange)
  .filterBounds(sa)
  // Pre-filter to get less cloudy granules.
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 5))
  .map(maskS2clouds);
  
print('cloudImageCollection.limit(x)', cloudImageCollection.limit(10))

//for display purposes
var rgbVis = {
  min: 0.0,
  max: 0.3,
  bands: ['B4', 'B3', 'B2'],
};

Map.setCenter(30.0, -28.94, 6);
//add sattelite image layer of
Map.addLayer(cloudImageCollection.median(), rgbVis, 'RGB');
//show the bounds of South Africa
Map.addLayer(sa, rgbVis, 'RGB', true, 0.4);

// // Generate random points within South Africa
var numPoints = 5; // Adjust the number of points as needed

// Divide the South Africa boundary into smaller sub-polygons
var subPolygons = region.limit(numPoints).filterBounds(sa).geometry();
print('subPolygons', subPolygons);

var displayPoints = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
  .filter(ee.Filter.eq('country_na', 'South Africa'));
var randomSeed = Math.floor(Math.random() * 1000000);
var randomPoints = ee.FeatureCollection.randomPoints({region: displayPoints.geometry(), points: numPoints, seed: randomSeed});

print('Random Points', randomPoints);

// // Display random points on the map
Map.addLayer(randomPoints, { color: 'FF0000' }, 'Random Points');

// Define the region of interest for the map screenshot
var mapRegion = sa.geometry().centroid().buffer(5000).bounds(); // Adjust the buffer size as needed
print('sa geom', sa.geometry());
print('mapRegion', mapRegion);

// Set the visualization parameters for the map
var mapVisParams = {
  bands: ['B4', 'B3', 'B2'],
  min: 0.0,
  max: 0.3
};

// Generate a map image
var mapImage = ee.Image(cloudImageCollection.median()).clip(mapRegion);

// Add the map image to the map
Map.addLayer(mapImage, mapVisParams, 'Map Image');


//test if the following function will work
  print('random points filtered to SA', randomPoints.filterBounds(sa));
  var point = ee.Geometry.Point(randomPoints.first().geometry().coordinates());
  
  print('coords', point);
  print('region.filterBounds(point).first();', region.filterBounds(point).first());
  var image = region.filterBounds(point);
  
  // var f = function(feature){}
  // print('image map', image.map(f));
  
  print('image', image)
  print('image.first()', image.first());
  print('image bands', image.first().bandNames())
  var radiation = image.first().select('surface_net_solar_radiation_sum');
  print('radiation', radiation.projection().nominalScale());
//end test


var getSolarIrradiationForRandomPoints = function(feature) {
  var point = ee.Geometry.Point(feature.geometry().coordinates());
  
  var image = region.filterBounds(point).first();
  var min = image.select('surface_net_solar_radiation_min').projection().nominalScale();
  var max = image.select('surface_net_solar_radiation_max').projection().nominalScale();
  
  return feature.set('surface_net_solar_radiation_min', min, 'surface_net_solar_radiation_max', max);
  
}

var solarIrradianceB2 = randomPoints.map(getSolarIrradiationForRandomPoints);

var solarRadMin = solarIrradianceB2.aggregate_array('surface_net_solar_radiation_min');
var solarRadMax = solarIrradianceB2.aggregate_array('surface_net_solar_radiation_max');
// print('sa', southAfrica);
print('solarIrradianceB2.first()',solarIrradianceB2.first());
print('solarIrradianceB2',solarIrradianceB2);
print('solar Irradiance Values (min)', solarRadMin);
print('solar Irradiance Values (max)', solarRadMax);

// Save the solar irradiance data as a CSV file in your Google Drive within the "GEE_outputs" folder
// Export.table.toDrive({
//   collection: pointData,
//   description: 'solar_irradiance_data',
//   folder: 'GEE_outputs',
//   fileFormat: 'CSV'
// });

