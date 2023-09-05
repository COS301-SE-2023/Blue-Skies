namespace BlazorApp.Data {
    public class TutorialService {
        public event Action<string, string, string>? ShowTutorialRequested;
        public event Action? HideTutorialRequested;

        public async void ShowTutorial(string title, string message, string type)
        {
            ShowTutorialRequested?.Invoke(title, message, type);
            await Task.Delay(6000);
            HideTutorial();
        }

        public void HideTutorial()
        {
            HideTutorialRequested?.Invoke();
        }
    }
}