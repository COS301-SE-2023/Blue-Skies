# python3 trainingData.py 2022 3 1

import os
import time
import sys
import concurrent.futures
from enum import Enum
import ee
import requests
from google.oauth2 import service_account
from dotenv import load_dotenv
from PIL import Image
 
class solarClass(Enum):
    # VERY_BAD = "Very_Bad"
    BAD = "Bad"
    AVERAGE = "Average"
    GOOD = "Good"
    # VERY_GOOD = "Very_Good"

# Your input parameters
end_year = int(sys.argv[1])
num_years = int(sys.argv[2])
num_points = int(sys.argv[3])

scale = 10

# very_bad_solar_radiation = 120
bad_solar_radiation = 120
average_solar_radiation = 210
# good_solar_radiation = 210


# Load environment variables from .env file
load_dotenv()

# Retrieve the credentials from environment variables
credentials = {
    'type': os.getenv('TYPE'),
    'project_id': os.getenv('PROJECT_ID'),
    'private_key_id': os.getenv('PRIVATE_KEY_ID'),
    'private_key': os.getenv('PRIVATE_KEY'),
    'client_email': os.getenv('CLIENT_EMAIL'),
    'client_id': os.getenv('CLIENT_ID'),
    'auth_uri': os.getenv('AUTH_URI'),
    'token_uri': os.getenv('TOKEN_URI'),
    'auth_provider_x509_cert_url': os.getenv('AUTH_PROVIDER_X509_CERT_URL'),
    'client_x509_cert_url': os.getenv('CLIENT_X509_CERT_URL'),
    'universe_domain': os.getenv('UNIVERSE_DOMAIN')
}

# Authenticate with Earth Engine using the environment variables
credentials = service_account.Credentials.from_service_account_info(credentials)
scoped_credentials = credentials.with_scopes(['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/earthengine'])
ee.Initialize(credentials=scoped_credentials)

print('Authenticated successfully.')

class imageRequest :
    def __init__(self, roi, start_date, end_date, latitude, longitude):
        self.roi = roi
        self.start_date = start_date
        self.end_date = end_date
        self.latitude = latitude
        self.longitude = longitude

    def download_and_save_image(self):
        # Filter the image collection based on cloud coverage
        collection = ee.ImageCollection('COPERNICUS/S2_HARMONIZED') \
            .filterBounds(self.roi) \
            .filterDate(self.start_date, self.end_date) \
            .sort('CLOUDY_PIXEL_PERCENTAGE') \
            .first()

        # Get the image from the collection
        image = ee.Image(collection)


        # Get the solar radiation for the specific image
        self.solar_radiation = get_solar_radiation(image, self.roi)

        # Check if both solar radiation and an image exist
        if self.solar_radiation != -1 and image.getInfo():
            # Format the date
            date_formatted = ee.Date(image.date()).format("YYYY_MM_dd")

            # Multiply solar radiation by 100 and convert to integer
            solar_radiation_number = ee.Number(self.solar_radiation)

            # Construct the image name
            # Make longitude and latitude strings with 3 decimal places
            self.image_name = f'{self.latitude:.3f}-{self.longitude:.3f}-{date_formatted.getInfo()}-{solar_radiation_number.getInfo()}'
            solar_class = get_solar_radiation_class(self.solar_radiation).value

            # Download and save the image locally
            image_url = image.getThumbURL({
                'region': self.roi,
                'bands': ['B4', 'B3', 'B2'],
                'min': 0.0,
                'max': 3000,
                'scale': 10
            })

            # Save in folder assests with the name of the image
            if not os.path.exists(f'assets/{solar_class}'):
                os.makedirs(f'assets/{solar_class}')
            image_path = f'assets/{solar_class}/{self.image_name}.png'
            image = Image.open(requests.get(image_url, stream=True).raw)
            image.save(image_path)
            print('Image', self.image_name, 'saved successfully.')
        else:
            print('Error: Cannot download the image. Either solar radiation or image is missing.')
        

image_requests = []

# Function to calculate solar radiation
def get_solar_radiation(image, roi):
    solar_radiation = -1
    if image is not None:
        date = image.date()
        solar_dataset = ee.ImageCollection('ECMWF/ERA5_LAND/DAILY_AGGR') \
            .filterDate(date, date.advance(1, 'day'))
        solar_image = solar_dataset.first()
        solar_image_roi = solar_image.clip(roi)
        solar_radiation_band = solar_image_roi.select('surface_net_solar_radiation_sum')
        solar_radiation_value = solar_radiation_band.reduceRegion(
            reducer=ee.Reducer.mean(),
            geometry=roi,
            scale=scale
        ).get('surface_net_solar_radiation_sum')
        if solar_radiation_value is not None:
            # solar radiation is in J/m^2/day so  / (24 * 60 * 60) to get W/m^2
            solar_radiation = ee.Number(solar_radiation_value).divide(24 * 60 * 60).getInfo()
    return solar_radiation

width = 0.05
height = 0.05

# Generate random points within South Africa
south_africa = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017').filter(ee.Filter.eq('country_na', 'South Africa'))
random_seed = int(time.time())  # Use the current timestamp as a seed
random_points = ee.FeatureCollection.randomPoints(region=south_africa.geometry(), points=num_points, seed=random_seed)

# Fetch the computed random points from the server
features = random_points.getInfo()['features']

def get_solar_radiation_class(solar_radiation):
    # if solar_radiation < very_bad_solar_radiation:
    #     return solarClass.VERY_BAD
    if solar_radiation < bad_solar_radiation:
        return solarClass.BAD
    elif solar_radiation < average_solar_radiation:
        return solarClass.AVERAGE
    # elif solar_radiation < good_solar_radiation:
    #     return solarClass.GOOD
    else:
        return solarClass.GOOD

# Iterate over each random point
for feature in features:
    # Fetch the computed point feature from the server
    point = ee.Feature(feature)
    point_info = point.getInfo()  # Fetch the computed geometry from the server
    latitude = point_info['geometry']['coordinates'][1]
    longitude = point_info['geometry']['coordinates'][0]
    # Create a rectangle representing the region of interest
    width = 0.05
    height = 0.05
    halfWidth = width / 2
    halfHeight = height / 2
    lowerLeft = [longitude - halfWidth, latitude - halfHeight]
    lowerRight = [longitude + halfWidth, latitude - halfHeight]
    upperRight = [longitude + halfWidth, latitude + halfHeight]
    upperLeft = [longitude - halfWidth, latitude + halfHeight]
    roi = ee.Geometry.Polygon([lowerLeft, lowerRight, upperRight, upperLeft])

    if num_years == 1:
        start_year = end_year
        end_year = start_year
        months_range = range(1, 13)
    else:
        start_year = end_year - num_years + 1
        months_range = range(1, 13)

    for year in range(start_year, end_year + 1):
        # print('Processing year', year)
        for month in range(1, 13):
            # Construct the start and end dates for the current month
            string_month = str(month).zfill(2)
            start_date = f'{year}-{string_month}-01'
            end_date = f'{year}-{string_month}-28'

            image_requests.append(imageRequest(roi, start_date, end_date, latitude, longitude))

# Function to download and save an image for an image request
def process_image_request(image_request):
    image_request.download_and_save_image()

# Limit the number of threads to 10
max_threads = 10
with concurrent.futures.ThreadPoolExecutor(max_workers=max_threads) as executor:
    # Submit the image requests to the executor
    future_to_request = {executor.submit(process_image_request, image_request): image_request for image_request in image_requests}
    
    # Wait for all threads to complete
    for future in concurrent.futures.as_completed(future_to_request):
        image_request = future_to_request[future]
        try:
            future.result()  # Get the result of the thread
        except Exception as e:
            print(f"An error occurred for image request: {image_request}. Error: {e}")