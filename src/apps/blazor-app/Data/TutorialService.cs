namespace BlazorApp.Data {
    public class TutorialService {
        public event Action? ShowTutorialModaRequested;
        public event Action? HideTutorialModalRequested;

        public event Action<string>? ToggleTutorialRequested;

        public void ShowTutorial() {
            ShowTutorialModaRequested?.Invoke();
        }

        public void HideTutorial() {
            HideTutorialModalRequested?.Invoke();
        }

        public void ToggleTutorial(string tutorialName) {
            ToggleTutorialRequested?.Invoke(tutorialName);
        }
    }
}