namespace BlazorApp.Data
{
    public class ApplianceService
    {
        public event Action<ApplianceModel>? IncrementApplianceCountRequested;
        public event Action<ApplianceModel>? DecrementApplianceCountRequested;

        public void IncrementApplianceCount(ApplianceModel appliance)
        {
            IncrementApplianceCountRequested?.Invoke(appliance);
        }

        public void DecrementApplianceCount(ApplianceModel appliance)
        {
            DecrementApplianceCountRequested?.Invoke(appliance);
        }
    }
}