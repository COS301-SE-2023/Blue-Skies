namespace BlazorApp.Data {
    public class TutorialService {
        public event Action ShowIntroTutorialRequested;
        public event Action ShowHomeTutorialRequested;
        public event Action HideHomeTutorialRequested;
        public event Action HideIntroTutorialRequested;

        public void ShowIntroTutorial() {
            ShowIntroTutorialRequested?.Invoke();
        }

        public void HideIntroTutorial() {
            HideIntroTutorialRequested?.Invoke();
        }

        public void ShowHomeTutorial() {
            ShowHomeTutorialRequested?.Invoke();
        }

        public void HideHomeTutorial() {
            HideHomeTutorialRequested?.Invoke();
        }
    }
}