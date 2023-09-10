from osgeo import gdal
import numpy as np
from PIL import Image
from matplotlib.colors import LinearSegmentedColormap

# Enable GDAL exceptions
gdal.UseExceptions()

parent_path = 'location-1'

satellite_image_path = f'{parent_path}/SatelliteImage'
mask_path = f'{parent_path}/Mask'
annualFlux_path = f'{parent_path}/annualFlux'
dsm_path = f'{parent_path}/DSM'
monthlyFlux_path = f'{parent_path}/monthlyFlux'

satellite_image = Image.open(satellite_image_path)
mask_image = Image.open(mask_path)

def getSatteImage(satellite_image):
    satellite_image.save(f'{parent_path}/SatelliteImage.png')
    print("Satellite image saved as 'SatelliteImage.png'")

def getRoofopImage(satellite_image, mask_image):
    if satellite_image.size != mask_image.size:
        raise ValueError("The satellite image and DSM must have the same dimensions")
    
    result_image = Image.new("RGB", satellite_image.size)
    for x in range(satellite_image.width):
        for y in range(satellite_image.height):
            pixel_color = satellite_image.getpixel((x, y))
            mask_pixel = mask_image.getpixel((x, y))
            if mask_pixel == 1:
                result_image.putpixel((x, y), pixel_color)
            else:
                gray_value = int(sum(pixel_color) / 3)
                result_image.putpixel((x, y), (gray_value, gray_value, gray_value))

    result_image.save(f'{parent_path}/Rooftop.tif')
    print("Result image saved as 'Rooftop.tif'")

def getHeighMap(dsm_path, output_path):
    dsm_dataset = gdal.Open(dsm_path)
    if dsm_dataset is None:
        raise ValueError("Failed to open DSM dataset")

    dsm_band = dsm_dataset.GetRasterBand(1)
    dsm_data = dsm_band.ReadAsArray()

    min_elevation = np.nanmin(dsm_data)
    max_elevation = np.nanmax(dsm_data)

    # Create a new grayscale image (as a NumPy array)
    height_map = np.zeros_like(dsm_data, dtype=np.uint8)

    # Normalize elevation values to the range [0, 255]
    height_map[~np.isnan(dsm_data)] = ((dsm_data[~np.isnan(dsm_data)] - min_elevation) / (max_elevation - min_elevation) * 255).astype(np.uint8)

    # Save the height map image as a grayscale PNG
    Image.fromarray(height_map, 'L').save(output_path)
    print(f"Height map saved as '{output_path}'")

def convertDataToYellowAndRedImage(masked_data, min_Data, max_Data, output_path, this_sattelite_image, this_mask_image, power=3):
    nan_color=(0, 0, 0)

    # Normalize the annual flux data to the [0, 1] range using min_flux and max_flux from the roof
    normalixed_data = (masked_data - min_Data) / (max_Data - min_Data)

    # Apply a non-linear mapping to the normalized data
    normalixed_data = np.power(normalixed_data, power)

    # Create a custom colormap that maps the lowest quarter to yellow, the highest quarter to red,
    # and the middle half to transition colors
    colors = [(1, 1, 0), (1, 0, 0)]  # Yellow to Red
    n_bins = 300  # Number of color bins
    cmap_name = "yellow_to_red"
    custom_cmap = LinearSegmentedColormap.from_list(cmap_name, colors, N=n_bins)

    # Apply the colormap to the normalized data
    colored_data = custom_cmap(normalixed_data)

    # Convert the colored flux data to an RGB image
    heatmap_image = (colored_data[:, :, :3] * 255).astype(np.uint8)

    # Handle NaN values by assigning nan_color
    nan_mask = np.isnan(masked_data)
    heatmap_image[nan_mask] = nan_color

    # Create a PIL Image object
    heatmap_pil_image = Image.fromarray(heatmap_image)

    # Apply the colored flux to the roof region in the satellite image
    for x in range(this_sattelite_image.width):
        for y in range(this_sattelite_image.height):
            mask_pixel = this_mask_image.getpixel((x, y))
            if mask_pixel == 1:
                heatmap_pixel = heatmap_pil_image.getpixel((x, y))
                this_sattelite_image.putpixel((x, y), heatmap_pixel)

    # Save the modified satellite image with the colored flux
    this_sattelite_image.save(output_path)
    print(f"New data map saved as '{output_path}'")

def getAnnualFluxMap(data_path):
    # Open the annual flux dataset
    dataset = gdal.Open(data_path)

    band = dataset.GetRasterBand(1)
    data = band.ReadAsArray()

    # Extract the roof region based on the mask_image
    masked_data = np.where(np.array(mask_image) == 1, data, np.nan)


    # Calculate min_flux and max_flux only for the roof region
    min_Data = np.nanmin(masked_data)
    max_Data = np.nanmax(masked_data)

    print(min_Data)
    print(max_Data)

    convertDataToYellowAndRedImage(masked_data, min_Data, max_Data, f'{parent_path}/FluxMap.png', satellite_image, mask_image, 3)

def getEveryMonthFluxMap(data_path):
    # Open the annual flux dataset
    dataset = gdal.Open(data_path)
    
    highest_data_all = 0
    lowest_data_all = 5000


    for i in range(1, 13):
        band = dataset.GetRasterBand(i)
        data = band.ReadAsArray()
        data_shape = data.shape

        # Extract the roof region based on the mask_image
        resized_mask_image = mask_image.resize((data_shape[1], data_shape[0]))

        masked_data = np.where(np.array(resized_mask_image) == 1, data, np.nan)

        # Calculate min_flux and max_flux only for the roof region
        min_Data = np.nanmin(masked_data)
        max_Data = np.nanmax(masked_data)

        if min_Data < lowest_data_all:
            lowest_data_all = min_Data

        if max_Data > highest_data_all:
            highest_data_all = max_Data

    for i in range(1, 13):
        band = dataset.GetRasterBand(i)
        data = band.ReadAsArray()
        data_shape = data.shape

        resized_satellite_image = satellite_image.resize((data_shape[1], data_shape[0]))
        resized_mask_image = mask_image.resize((data_shape[1], data_shape[0]))

        # Extract the roof region based on the mask_image
        masked_data = np.where(np.array(resized_mask_image) == 1, data, np.nan)

        convertDataToYellowAndRedImage(masked_data, lowest_data_all, highest_data_all, f'{parent_path}/Month-{i}-FluxMap.png', resized_satellite_image, resized_mask_image, 3)
    
getSatteImage(satellite_image)
getHeighMap(dsm_path, f'{parent_path}/HeightMap.png')
getAnnualFluxMap(annualFlux_path)
getEveryMonthFluxMap(monthlyFlux_path)

satellite_image.close()
mask_image.close()