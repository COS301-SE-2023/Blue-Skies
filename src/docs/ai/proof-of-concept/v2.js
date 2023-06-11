//This code snippet generates random numbers and retrieves satellite images and satellite radiation information from Google Earth Engine based on the generated coordinates

//Keep it's for Google Earth Engine
function maskS2clouds(image) 
{
    var qa = image.select('QA60');
  
    // Bits 10 and 11 are clouds and cirrus, respectively.
    var cloudBitMask = 1 << 10;
    var cirrusBitMask = 1 << 11;
  
    // Both flags should be set to zero, indicating clear conditions.
    var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
      .and(qa.bitwiseAnd(cirrusBitMask).eq(0));
  
    return image.updateMask(mask).divide(10000);
}
//Do not delete


//get dates
var startDate = ee.Date('2020-06-01');
var endDate = ee.Date('2020-06-30');
var timeRange = ee.DateRange(startDate, endDate);

var sa = ee.FeatureCollection('FAO/GAUL/2015/level0')
.filter(ee.Filter.eq('ADM0_NAME', 'South Africa'));

// // Generate random points within South Africa
var numPoints = 5; // Adjust the number of points as needed

var randomSeed = Math.floor(Math.random() * 1000000);
var randomPoints = ee.FeatureCollection.randomPoints({region: sa.geometry(), points: numPoints, seed: randomSeed});

// // Display random points on the map
Map.addLayer(randomPoints, { color: 'FF0000' }, 'Random Points');

//get sattelite images for < 5% cloud coverage 
var cloudImageCollection = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
.filterDate(timeRange)
.filterBounds(randomPoints)
// Pre-filter to get less cloudy granules.
.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 5))
.map(maskS2clouds);

//for display purposes
var rgbVis = {
min: 0.0,
max: 0.3,
bands: ['B4', 'B3', 'B2'],
};

Map.setCenter(30.0, -28.94, 6);
//add sattelite image layer of
Map.addLayer(cloudImageCollection.median(), rgbVis, 'Images of the random points');