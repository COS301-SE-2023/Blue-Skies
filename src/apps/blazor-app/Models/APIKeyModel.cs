using System.ComponentModel.DataAnnotations;

namespace BlazorApp.Models;

public class APIKeyModel
{
    public int keyId { get; set; }
    public string? owner { get; set; }
    public string? APIKey { get; set; }
    public int remainingCalls { get; set; }
    public int suspended { get; set; }
    public bool recordState { get; set; }
}
