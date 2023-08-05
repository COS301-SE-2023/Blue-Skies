using System.ComponentModel.DataAnnotations;

namespace BlazorApp.Models;
public class TabItemModel
{
  public bool active { get; set; }
  public string title { get; set; } = "";
  public TabItemModel(string title, bool active)
  {
    this.title = title;
    this.active = active;
  }
}