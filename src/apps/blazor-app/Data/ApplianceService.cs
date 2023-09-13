namespace BlazorApp.Data
{
    public class ApplianceService
    {
        public event Action<List<ApplianceModel>>? UpdateAppliancesRequested;

        public void UpdateAppliance(List<ApplianceModel> appliances)
        {
            foreach (var appliance in appliances)
            {
                Console.WriteLine($"Appliance: {appliance.type} - {appliance.quantity}");
            }
            UpdateAppliancesRequested?.Invoke(appliances);
        }

    }
}