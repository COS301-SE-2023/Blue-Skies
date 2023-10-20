using Newtonsoft.Json;

namespace Api.Repository;

public class BusinessBestSolarPanelsRepository
{
    
    private SharedUtils.locationDataClass locationDataClass = new SharedUtils.locationDataClass();
    private DataHandlers.SolarDataHandler solarCalculator = new DataHandlers.SolarDataHandler();
    private DataHandlers.RooftopDataHandler rooftopDataHandler = new DataHandlers.RooftopDataHandler();
    private SharedUtils.otherDataClass otherDataClass = new SharedUtils.otherDataClass();
    private string locationName = "";
   
    public async Task<string> GetProcessedDataAsync(BestSolarPanelsInput bestSolarPanelsInput)
    {
        LocationDataModel? currentLocationData = new LocationDataModel();
        try
        {
            int numPanels = bestSolarPanelsInput.total_panels ?? 0;
            double latitude = bestSolarPanelsInput.latitude;
            double longitude = bestSolarPanelsInput.longitude;

            var client = new HttpClient();
            var dataTypeResponse = new HttpResponseMessage();

            if(numPanels==0)
            {
                return "Number of panels left blank, or cannot be 0.";
            } else if(numPanels<0)
            {
                return "Number of panels cannot be negative.";
            }

            LocationDataModel? locationData = await locationDataClass.GetLocationData(latitude, longitude);
            locationName = await otherDataClass.GetLocationNameFromCoordinates(latitude, longitude);
            if (locationData == null)
            {                
                await locationDataClass.CreateLocationData(latitude, longitude, locationName);
            }

            List<BestSolarPanelsOutput> solarPanels = await GetBestSolarPanelsOutputAsync(numPanels, latitude, longitude);
            dataTypeResponse.Content = new StringContent(JsonConvert.SerializeObject(solarPanels));

            return await dataTypeResponse.Content.ReadAsStringAsync();



        }
        catch (Exception)
        {
            throw new Exception("Could not create Solar Panel Orientation Data. NOTE that a valid address should be used.");
 
        }
    }

    private async Task<List<BestSolarPanelsOutput>> GetBestSolarPanelsOutputAsync(int numPanels, double latitude, double longitude)
    {
        LocationDataModel? locationData = await locationDataClass.GetLocationData(latitude, longitude);
        List<Solarpanel> solarPanels = solarCalculator.getBestSolarPanels(numPanels, locationData!.solarPanelsData!)!;
        List<BestSolarPanelsOutput> bestSolarPanelsOutputs = convertSolarPanelsToBestSolarPanelsOutput(solarPanels);
        return bestSolarPanelsOutputs;
    }
    private List<BestSolarPanelsOutput> convertSolarPanelsToBestSolarPanelsOutput(List<Solarpanel> solarPanels)
    {
        List<BestSolarPanelsOutput> bestSolarPanels = new List<BestSolarPanelsOutput>();
        foreach(Solarpanel solarPanel in solarPanels)
        {
            BestSolarPanelsOutput bestSolarPanel = new BestSolarPanelsOutput();
            bestSolarPanel.orientation = solarPanel.orientation!;
            bestSolarPanel.yearlyEnergyDcKwh = solarPanel.yearlyEnergyDcKwh!;
            bestSolarPanel.latitude = solarPanel.center!.latitude!;
            bestSolarPanel.longitude = solarPanel.center!.longitude!;
            bestSolarPanels.Add(bestSolarPanel);
        }
        return bestSolarPanels;
    }
    private async Task<LocationDataModel> GetLocationDataModel(double latitude, double longitude)
    {
        LocationDataModel? locationData = await locationDataClass.GetLocationData(latitude, longitude);
        if(locationData==null){
            locationData = await locationDataClass.CreateLocationData(latitude, longitude, locationName);
        }
        return locationData!;
    }
}
