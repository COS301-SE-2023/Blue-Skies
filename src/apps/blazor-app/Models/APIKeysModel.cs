using System.ComponentModel.DataAnnotations;

namespace BlazorApp.Models;
public class APIKeysModel
{
    public int KeyId { get; set; }
    public string? Owner { get; set; }
    public string? Key { get; set; }
    public int remainingCalls { get; set; }
}
