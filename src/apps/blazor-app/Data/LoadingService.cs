
namespace BlazorApp.Data {
    public class LoadingService
    {
        public event Action? ShowLoadingScreenRequested;
        public event Action? HideLoadingScreenRequested;

        public void ShowLoadingScreen()
        {
            ShowLoadingScreenRequested?.Invoke();
        }

        public void HideLoadingScreen()
        {
            HideLoadingScreenRequested?.Invoke();
        }
    }

}
