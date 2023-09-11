public class KeyModel
{
    public int keyId { get; set; }
    public string? APIKey { get; set; }
    public int remainingCalls { get; set; }
    public int suspended { get; set; }
    public string? owner { get; set; }
    public int isBusiness { get; set; }
    public string? description { get; set; }
    public string? location { get; set; }
    public string? website { get; set; }
    public string? phoneNumber { get; set; }
    public string? email { get; set; }
    public bool recordState { get; set; }
}
