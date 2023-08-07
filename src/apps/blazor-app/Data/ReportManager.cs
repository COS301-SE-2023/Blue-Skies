
namespace BlazorApp.Data {
    public class ReportManager
    {
        public event Action? EditReportRequested;

        public event Func<Task>? DeleteReportRequested;

        public void EditReport()
        {
            EditReportRequested?.Invoke();
        }

        public async Task DeleteReport()
        {
            if (DeleteReportRequested is not null)
            {
                await DeleteReportRequested.Invoke();
            }
        }
    }

}
