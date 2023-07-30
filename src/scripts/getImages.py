# python3 getImages.py -25.771 28.357 2022 3 solarScoreId

import os
import sys
import concurrent.futures
import ee
import threading
import requests
from google.oauth2 import service_account
from dotenv import load_dotenv
from PIL import Image
import json

LATITUDE = float(sys.argv[1])
LONGITUDE = float(sys.argv[2])
YEAR = int(sys.argv[3])
TIME_FRAME = int(sys.argv[4])
SOLAR_SCORE_ID = sys.argv[5]

# Load environment variables from .env file
load_dotenv()
file_lock = threading.Lock()
API_PORT = os.getenv('API_PORT')
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

# Create a rectangle representing the region of interest
width = 0.05
height = 0.05
halfWidth = width / 2
halfHeight = height / 2
lowerLeft = [LONGITUDE - halfWidth, LATITUDE - halfHeight]
lowerRight = [LONGITUDE + halfWidth, LATITUDE - halfHeight]
upperRight = [LONGITUDE + halfWidth, LATITUDE + halfHeight]
upperLeft = [LONGITUDE - halfWidth, LATITUDE + halfHeight]
roi = ee.Geometry.Polygon([lowerLeft, lowerRight, upperRight, upperLeft])

def download_and_save_image(image, roi, imageName):
    image_url = image.getThumbURL({
        'region': roi,
        'bands': ['B4', 'B3', 'B2'],
        'min': 0.0,
        'max': 3000,
        'scale': 10
    })

    image_path = f'apps/api/assets/{imageName}-{SOLAR_SCORE_ID}.png'
    image = Image.open(requests.get(image_url, stream=True).raw)
    new_image = f'{imageName}-{SOLAR_SCORE_ID}'
    image.save(image_path)
    print('Image', imageName, 'saved successfully.')
    file_lock.acquire()
    try:
        print('Getting solar score for image')
        url = API_PORT+ "/SolarScore/GetSolarScoreFromImage"

        payload = json.dumps({
        "imgName": new_image,
        "solarScoreId": SOLAR_SCORE_ID
        })
        headers = {
        'Content-Type': 'application/json'
        }

        response = requests.request("GET", url, headers=headers, data=payload)
        print(response.text)
    finally:
        # Release the lock after saving the image
        file_lock.release()
    


with concurrent.futures.ThreadPoolExecutor() as executor:
    for i in range(YEAR - TIME_FRAME + 1, YEAR + 1):
        stringYear = str(i)
        for MONTH in range(1, 13):
            stringMonth = '0' + str(MONTH) if MONTH < 10 else str(MONTH)
            startDate = stringYear + '-' + stringMonth + '-01'
            endDate = stringYear + '-' + stringMonth + '-28'

            collection = ee.ImageCollection('COPERNICUS/S2_HARMONIZED') \
                .filterBounds(roi) \
                .filterDate(startDate, endDate) \
                .sort('CLOUDY_PIXEL_PERCENTAGE') \
                .first()

            image = ee.Image(collection)
            imageName = stringYear + '-' + stringMonth

            executor.submit(download_and_save_image, image, roi, imageName)



    
