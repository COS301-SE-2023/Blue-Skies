namespace Api;

public class Keys
{
    public int keyId { get; set; }
    public string? owner { get; set; }
    public string? APIKey { get; set; }
    public int remainingCalls { get; set; }
    public int suspended { get; set; }
}
