import requests
import json
import os

latitude = -25.834274650158797
longitude = 28.293585887012288
requiredQuality = "HIGH"
api_key = os.getenv('GOOGLE_MAPS_API_KEY')

example_url = "https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=37.4450&location.longitude=-122.1390&requiredQuality=HIGH&key=YOUR_API_KEY"
url = "https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=" + str(latitude) + "&location.longitude=" + str(longitude) + "&requiredQuality=" + requiredQuality + "&key=" + api_key

response = requests.get(url)
print(response.json())