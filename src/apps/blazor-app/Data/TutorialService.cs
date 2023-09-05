namespace BlazorApp.Data {
    public class TutorialService {
        public event Action ShowTutorialRequested;
        public event Action HideTutorialRequested;

        public void ShowTutorial() {
            ShowTutorialRequested?.Invoke();
        }

        public void HideTutorial() {
            HideTutorialRequested?.Invoke();
        }
    }
}