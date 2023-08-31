#python3 GetSunTimes.py 40.730610 -73.935242 2023

import sys
import requests
from datetime import datetime, timedelta
from concurrent.futures import ThreadPoolExecutor

def get_sunrise_sunset(latitude, longitude, date):
    url = f'https://api.sunrise-sunset.org/json?lat={latitude}&lng={longitude}&date={date}&formatted=0'
    response = requests.get(url)
    data = response.json()
    sunrise = datetime.fromisoformat(data['results']['sunrise'])
    sunset = datetime.fromisoformat(data['results']['sunset'])
    return sunrise, sunset

def get_one_day_per_month(latitude, longitude, year):
    selected_dates = []

    with ThreadPoolExecutor() as executor:
        futures = []
        for month in range(1, 6):
            start_date = datetime(year, month, 1)
            selected_date = start_date + timedelta(days=14)
            future = executor.submit(get_sunrise_sunset, latitude, longitude, selected_date.strftime('%Y-%m-%d'))
            futures.append((selected_date, future))

        for selected_date, future in futures:
            sunrise_time, sunset_time = future.result()
            selected_dates.append((selected_date, sunrise_time, sunset_time))

    return selected_dates

def calculate_daylight_duration(latitude, longitude, date):
    sunrise_time, sunset_time = get_sunrise_sunset(latitude, longitude, date.strftime('%Y-%m-%d'))
    daylight_duration = sunset_time - sunrise_time
    return daylight_duration

def calculate_average_daylight(latitude, longitude, year):
    total_duration = timedelta()
    num_days = 0

    # Get one day from each month
    selected_dates = get_one_day_per_month(latitude, longitude, year)

    # Calculate total daylight duration for the year
    for date, _, _ in selected_dates:
        daylight_duration = calculate_daylight_duration(latitude, longitude, date)
        total_duration += daylight_duration
        num_days += 1

    # Calculate the average daylight duration for the year
    average_duration = total_duration / num_days

    return average_duration


latitude = float(sys.argv[1])  
longitude = float(sys.argv[2])  
year = int(sys.argv[3])

average_daylight = calculate_average_daylight(latitude, longitude, year)

# Convert the average daylight duration to hours and minutes
hours = average_daylight.seconds // 3600
minutes = (average_daylight.seconds // 60) % 60
minutes = minutes / 60
minutes = round(minutes, 2)
ans = hours + minutes
print(ans)

