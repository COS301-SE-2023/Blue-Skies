namespace BlazorApp.Data
{
    public class ApplianceService
    {
        public event Action<List<ApplianceModel>>? UpdateAppliancesRequested;

        public void UpdateAppliance(List<ApplianceModel> appliances)
        {
            UpdateAppliancesRequested?.Invoke(appliances);
        }

    }
}