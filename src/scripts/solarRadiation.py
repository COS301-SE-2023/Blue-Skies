# python3 solarRadiation.py -25.7652655 28.2784689 2022 3 48
import datetime
import os
import sys
import concurrent.futures
import threading
import json
import requests
from dotenv import load_dotenv
from google.oauth2 import service_account
import ee

LATITUDE = float(sys.argv[1])
LONGITUDE = float(sys.argv[2])
YEAR = int(sys.argv[3])
AMOUNT_OF_YEARS = int(sys.argv[4])
AMOUNT_OF_TIMES_PER_YEAR = int(sys.argv[5])

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
scoped_credentials = credentials.with_scopes(['https://www.googleapis.com/auth/cloud-platform',
    'https://www.googleapis.com/auth/earthengine'])
ee.Initialize(credentials=scoped_credentials)

print('Authenticated successfully.')

# Create a rectangle representing the region of interest
scale = 10
width = 0.01
height = 0.01
halfWidth = width / 2
halfHeight = height / 2
lowerLeft = [LONGITUDE - halfWidth, LATITUDE - halfHeight]
lowerRight = [LONGITUDE + halfWidth, LATITUDE - halfHeight]
upperRight = [LONGITUDE + halfWidth, LATITUDE + halfHeight]
upperLeft = [LONGITUDE - halfWidth, LATITUDE + halfHeight]
roi = ee.Geometry.Polygon([lowerLeft, lowerRight, upperRight, upperLeft])

dates = []
solar_radiations = [[] for i in range(12)]
amount_of_calls_left = AMOUNT_OF_YEARS * AMOUNT_OF_TIMES_PER_YEAR
data_to_be_called_to_database = 0
data = ""

def get_date(day):
    month = 1
    if day > 31:
        day -= 31
        month += 1
    if day > 28:
        day -= 28
        month += 1
    if day > 31:
        day -= 31
        month += 1
    if day > 30:
        day -= 30
        month += 1
    if day > 31:
        day -= 31
        month += 1
    if day > 30:
        day -= 30
        month += 1
    if day > 31:
        day -= 31
        month += 1
    if day > 31:
        day -= 31
        month += 1
    if day > 30:
        day -= 30
        month += 1
    if day > 31:
        day -= 31
        month += 1
    if day > 30:
        day -= 30
        month += 1
    return [month, day]

for i in range(YEAR - AMOUNT_OF_YEARS + 1, YEAR + 1):
    for frac in range(1, AMOUNT_OF_TIMES_PER_YEAR + 1):
        if(frac < 365):
            day = int((365/AMOUNT_OF_TIMES_PER_YEAR * frac) - (365/AMOUNT_OF_TIMES_PER_YEAR/2))
            date = get_date(day)
            date = datetime.date(i, date[0], date[1])
            dates.append(date)

def reduce_amount_of_calls_left():
    global amount_of_calls_left
    global data_to_be_called_to_database
    file_lock.acquire()
    try:
        amount_of_calls_left -= 1
        data_to_be_called_to_database += 1
        if(data_to_be_called_to_database >= 10) or (amount_of_calls_left <= 5):
            url = API_PORT + "/SolarScore/updateSolarIrradiation"

            payload = json.dumps({
                "data": data,
                "remainingCalls": amount_of_calls_left,
                "latitude": LATITUDE,
                "longitude": LONGITUDE
            })
            
            headers = {
                'Content-Type': 'application/json'
            }
            requests.request("PATCH", url, headers=headers, data=payload)
            data_to_be_called_to_database = 0
    finally:
        file_lock.release()


def get_solar_radiation(date):
    global amount_of_calls_left
    global data_to_be_called_to_database
    global data
    solar_radiation = -1
    next_day = date + datetime.timedelta(days=1)  # Calculate the next day using timedelta
    solar_dataset = ee.ImageCollection('ECMWF/ERA5_LAND/DAILY_AGGR') \
        .filterDate(date.strftime("%Y-%m-%d"), next_day.strftime("%Y-%m-%d"))
    if solar_dataset is None and solar_dataset.size().getInfo() == 0:
        print("Error: solar dataset is empty")
        reduce_amount_of_calls_left()
        return
    solar_image = solar_dataset.first()
    if solar_image is None:
        print("Error: solar image is empty")
        reduce_amount_of_calls_left()
        return
    solar_image_roi = solar_image.clip(roi)
    if solar_image_roi is None:
        print("Error: solar image roi is empty")
        reduce_amount_of_calls_left()
        return
    solar_radiation_band = solar_image_roi.select('surface_net_solar_radiation_sum')
    if solar_radiation_band.getInfo() is None:
        print("Error: solar radiation band is empty")
        reduce_amount_of_calls_left()
        return
    
    solar_radiation_value_before = solar_radiation_band.reduceRegion(
        reducer = ee.Reducer.mean(),
        geometry = roi,
        scale = scale
    ).getInfo()
    
    solar_radiation_value = solar_radiation_value_before.get('surface_net_solar_radiation_sum')
    if solar_radiation_value is not None and solar_radiation_value is not None:
        # solar radiation is in J/m^2/day so  / (24 * 60 * 60) to get W/m^2
        solar_radiation = ee.Number(solar_radiation_value).divide(24 * 60 * 60).getInfo()
    else:
        print("Error: solar radiation value is empty")
        reduce_amount_of_calls_left()
        return

    if(solar_radiation != -1):
        file_lock.acquire()
        try:
            amount_of_calls_left -= 1
            data_to_be_called_to_database += 1
            solar_radiations[date.month - 1].append([date, solar_radiation])
            data += str(date) + ";" + str(solar_radiation) + ","

            if(data_to_be_called_to_database >= 10) or (amount_of_calls_left <= 5):
                url = API_PORT + "/SolarScore/updateSolarIrradiation"

                payload = json.dumps({
                "data": data,
                "remainingCalls": amount_of_calls_left,
                "latitude": LATITUDE,
                "longitude": LONGITUDE
                })
                
                headers = {
                    'Content-Type': 'application/json'
                }
                requests.request("PATCH", url, headers=headers, data=payload)
                data_to_be_called_to_database = 0
        finally:
            file_lock.release()
    else:
        print("Error: solar radiation is -1")
        reduce_amount_of_calls_left()

with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
    for date in dates:
        executor.submit(get_solar_radiation, date)

print("File is done")