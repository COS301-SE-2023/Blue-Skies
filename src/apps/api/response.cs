namespace Api;

public class Response
{
  public string? message { get; set; }
  public string? details { get; set; }

  //Create ToString method to return a string
  public override string ToString()
  {
    return "{\r\n    \"message\" : \"" + message + "\",\r\n    \"details\" : \"" + details + "\"\r\n}";
  }
}