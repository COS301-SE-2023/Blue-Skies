import requests
import json
import os

latitude = -25.771950
longitude = 28.356573

folder_name = 'demmo'
if not os.path.exists(folder_name):
    os.mkdir(folder_name)
else:
    print("Folder already exists")
    # Ask the user if they want to overwrite the existing folder
    overwrite = input("Do you want to overwrite the existing folder? (y/n): ")
    if overwrite == "y":
        print("Overwriting existing folder")
    else:
        print("Exiting program")
        exit()

radiusMeters = 50
view = "IMAGERY_AND_ALL_FLUX_LAYERS"
requiredQuality = "HIGH"
pixelSizeMeters = 0.1
api_key = "AIzaSyAOQKZ0T7z-jFuW6PDjPb2bepliU9qDV9M"

if(api_key == None):
    print("Please set the GOOGLE_MAPS_API_KEY environment variable")
    exit()

url = "https://solar.googleapis.com/v1/dataLayers:get?location.latitude=" + str(latitude) + "&location.longitude=" + str(longitude) + "&radiusMeters=" + str(radiusMeters) + "&view=" + view + "&requiredQuality=" + requiredQuality + "&pixelSizeMeters=" + str(pixelSizeMeters) + "&key=" + str(api_key)

response = requests.get(url)

def getData(url):
    print("Getting data from " + url)
    url += "&key=" + str(api_key)
    
    response = requests.get(url)
    # Check if the request was successful (status code 200)
    if response.status_code == 200:
        return response.content

if(response.status_code == 200):
    print("Request successful.")
    # Create a folder to store the data layer
    data = response.json()

    try:
        with open(folder_name + "/DSM", "wb") as file:
            byteData = getData(data["dsmUrl"])
            file.write(byteData)
    except Exception as e:
        print(f"An error occurred during download: {str(e)}")

    try:
        with open(folder_name + "/SatelliteImage", "wb") as file:
            file.write(getData(data["rgbUrl"]))
    except Exception as e:
        print(f"An error occurred during download: {str(e)}")

    try:
        with open(folder_name + "/Mask", "wb") as file:
            file.write(getData(data["maskUrl"]))
    except Exception as e:
        print(f"An error occurred during download: {str(e)}")

    with open(folder_name + "/annualFlux", "wb") as file:
        file.write(getData(data["annualFluxUrl"]))
    
    try:
        with open(folder_name + "/monthlyFlux", "wb") as file:
            file.write(getData(data["monthlyFluxUrl"]))
    except Exception as e:
        print(f"An error occurred during download: {str(e)}")

else:
    print("Request failed. Status code: " + str(response.status_code))
    print(response.content)