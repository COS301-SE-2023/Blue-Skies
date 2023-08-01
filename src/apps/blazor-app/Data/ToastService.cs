
namespace BlazorApp.Data {
    public class ToastService
    {
        public event Action<string, string>? ShowToastRequested;

        public void ShowToast(string message, string type)
        {
            ShowToastRequested?.Invoke(message, type);
        }
    }

}
