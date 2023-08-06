using System.ComponentModel.DataAnnotations;

namespace BlazorApp.Models;

public class AccordionItemModel
{
  public Guid id { get; set; } = new Guid();
  public bool active { get; set; }
  public string title { get; set; } = "";
  public string content { get; set; } = "";
  public AccordionItemModel(string title, string content, bool active)
  {
    this.id = Guid.NewGuid();
    this.title = title;
    this.content = content;
    this.active = active;
  }

  public Guid GetId()
  {
    return id;
  }
}