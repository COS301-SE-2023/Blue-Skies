
namespace BlazorApp.Data {
    public class ToastService
    {
        public event Action<string, string, string>? ShowToastRequested;
        public event Action? HideToastRequested;

        public async void ShowToast(string title, string message, string type)
        {
            ShowToastRequested?.Invoke(title, message, type);
            await Task.Delay(4000);
            HideToast();
        }

        public void HideToast()
        {
            HideToastRequested?.Invoke();
        }
    }

}
