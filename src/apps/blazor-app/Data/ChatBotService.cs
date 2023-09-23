
namespace BlazorApp.Data {
    public class ChatBotService
    {
        public event Action? ShowChatBotRequested;
        public event Action? HideChatBotRequested;

        public void ShowChatBot(string title, string message, string type)
        {
            ShowChatBotRequested?.Invoke();
        }

        public void HideChatBot()
        {
            HideChatBotRequested?.Invoke();
        }
    }

}
