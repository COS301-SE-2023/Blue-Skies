
namespace BlazorApp.Data {
    public class ToastService
    {
        public event Action<string, string, string>? ShowToastRequested;
        public event Action? HideToastRequested;

        public void ShowToast(string title, string message, string type)
        {
            ShowToastRequested?.Invoke(title, message, type);
        }

        public void HideToast()
        {
            HideToastRequested?.Invoke();
        }
    }

}
