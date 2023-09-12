namespace BlazorApp.Data {
    public class TutorialService {
        public event Action? ShowTutorialModalRequested;
        public event Action? HideTutorialModalRequested;

        public event Action<string>? ToggleTutorialRequested;

        public void ShowTutorial() {
            ShowTutorialModalRequested?.Invoke();
        }

        public void HideTutorial() {
            HideTutorialModalRequested?.Invoke();
        }

        public void ToggleTutorial(string tutorialName) {
            ToggleTutorialRequested?.Invoke(tutorialName);
        }
    }
}