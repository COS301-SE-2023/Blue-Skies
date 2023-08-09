
namespace BlazorApp.Data {
    public class ReportManager
    {
        public event Action? EditReportRequested;

        public event Action? DeleteReportRequested;

        public void EditReport()
        {
            EditReportRequested?.Invoke();
        }

        public void DeleteReport()
        {
            DeleteReportRequested?.Invoke();
        }
    }

}
