namespace BlazorApp.Data
{
    public class ApplianceService
    {
        public event Action<List<ApplianceModel>>? UpdateAppliancesRequested;

        public event Action ClearSearchRequested;

        public void UpdateAppliance(List<ApplianceModel> appliances)
        {
            Console.WriteLine("UpdateAppliance");
            UpdateAppliancesRequested?.Invoke(appliances);
        }

        public void ClearSearch()
        {
            ClearSearchRequested?.Invoke();
        }

    }
}