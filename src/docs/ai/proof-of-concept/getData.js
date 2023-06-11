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

// Get dates
var startDate = ee.Date('2020-06-01');
var endDate = ee.Date('2020-06-30');
var timeRange = ee.DateRange(startDate, endDate);

var southAfrica = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
    .filter(ee.Filter.eq('country_na', 'South Africa'));

// Generate random points within South Africa
var numPoints = 10; // Adjust the number of points as needed

var randomSeed = Math.floor(Math.random() * 1000000);
var randomPoints = ee.FeatureCollection.randomPoints({ region: southAfrica.geometry(), points: numPoints, seed: randomSeed });

// Display random points on the map
Map.addLayer(randomPoints, { color: 'FF0000' }, 'Random Points');

// Function to generate square geometries centered on each point
function createSquare(point, size) 
{
    var halfSize = size.divide(2);
    var centroid = point.geometry().centroid();
    var coordinates = centroid.buffer(halfSize).bounds();
    return ee.Feature(coordinates);
}

// Get satellite images for < 5% cloud coverage
var satelliteImages = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
    .filterDate(timeRange)
    .filterBounds(randomPoints)
    // Pre-filter to get less cloudy granules.
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 5))
    .map(maskSentinel2Clouds);

// For display purposes
var visualizationParams = {
    min: 0.0,
    max: 0.3,
    bands: ['B4', 'B3', 'B2'],
};

// Display zoomed-in images
var zoomedInImages = satelliteImages.map(function (image) 
{
    var squareAreas = randomPoints.map(function (point) 
    {
        return createSquare(point, ee.Number(3000)); // Adjust the square size as needed
    });
    return image.visualize(visualizationParams).clip(squareAreas);
});

// Add satellite image layer of zoomed-in images
Map.addLayer(zoomedInImages.median(), {}, 'Zoomed-in Images of the random points', true, 1);