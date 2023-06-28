//This code snippet generates random numbers and retrieves satellite images and satellite radiation information from Google Earth Engine based on the generated coordinates

// Keep it's for Google Earth Engine
function maskSentinel2Clouds(image) 
{
    var qualityAssessment = image.select('QA60');

    // Bits 10 and 11 are clouds and cirrus, respectively.
    var cloudBitMask = 1 << 10;
    var cirrusBitMask = 1 << 11;

    // Both flags should be set to zero, indicating clear conditions.
    var mask = qualityAssessment.bitwiseAnd(cloudBitMask).eq(0)
        .and(qualityAssessment.bitwiseAnd(cirrusBitMask).eq(0));

    return image.updateMask(mask).divide(10000);
}
// Do not delete

var endYear = 2022;
var numYears = 1;
var numPoints = 1;
var areaSize = 2000;

var southAfrica = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
    .filter(ee.Filter.eq('country_na', 'South Africa'));

// Generate random points within South Africa
var randomSeed = Math.floor(Math.random() * 1000000);
var randomPoints = ee.FeatureCollection.randomPoints({ region: southAfrica.geometry(), points: numPoints, seed: randomSeed });

// Display random points on the map
Map.addLayer(randomPoints, { color: 'FF0000' }, 'Random Points');

// For display purposes
var visualizationParams = {
    min: 0.0,
    max: 0.3,
    bands: ['B4', 'B3', 'B2'],
};

// Function to generate square geometries centered on each point
function createSquare(point, size) 
{
    var halfSize = size.divide(2);
    var centroid = point.geometry().centroid();
    var coordinates = centroid.buffer(halfSize).bounds();
    return ee.Feature(coordinates);
}


for(var year = endYear - numYears + 1; year <= endYear; year++)
{
  for(var i = 1; i <= 12; i++) {
    // Get dates
    var stringDateMonth = i < 10 ? '0' + i : i;
    var startDate = ee.Date(year + '-' + stringDateMonth + '-01');
    var endDate = ee.Date(year + '-' + stringDateMonth + '-28');
    var timeRange = ee.DateRange(startDate, endDate);
    
    // Get satellite images for < 5% cloud coverage
    var satelliteImages = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
        .filterDate(timeRange)
        .filterBounds(randomPoints)
        // Pre-filter to get less cloudy granules.
        .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 5))
        .map(maskSentinel2Clouds);
        
    // Display zoomed-in images
    var zoomedInImages = satelliteImages.map(function (image) 
    {
        var squareAreas = randomPoints.map(function (point) 
        {
            return createSquare(point, ee.Number(areaSize)); // Adjust the square size as needed
        });
        return image.visualize(visualizationParams).clip(squareAreas);
    });
    
    var newVis = {
      min: 0.0,
      max: 0.9,
      bands: ['vis-red', 'vis-green', 'vis-blue'],
    };
    
    // Export each zoomed-in image
    var images = zoomedInImages.toList(zoomedInImages.size());
    var numImages = images.size().getInfo();
    if (numImages > 0) {
      for (var j = 0; j < numImages; j++) {
        var image = ee.Image(images.get(j));
        console.log(image);
        var feature = ee.Feature(images.get(j));
        var imageName = 'Year ' + feature.get('year') + ', Month ' + feature.get('month');
        Export.image.toDrive({
          image: image.visualize(newVis),
          description: imageName,
          folder: 'Training_Data',
          fileNamePrefix: imageName,
          scale: 10,
          crs: 'EPSG:4326',
          maxPixels: 1e13
        });
      }
    } else {
      console.log('No images found for Year ' + year + ', Month ' + i);
    }
    
    // Add satellite image layer of zoomed-in images
    Map.addLayer(zoomedInImages.median(), {}, 'Year ' + year + 'Month ' + i, false, 1);
  }
}