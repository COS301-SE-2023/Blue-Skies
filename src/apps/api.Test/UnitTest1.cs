

using Microsoft.AspNetCore.Mvc.Testing;

namespace Api.Test;

public class Tests
{
  [SetUp]
  public void Setup()
  {
  }

  [Test]
  public async Task Test1()
  {

    var webFactory = new WebApplicationFactory<Program>();
    var httpClient = webFactory.CreateDefaultClient();

    var response = await httpClient.GetAsync("/");
    var result = await response.Content.ReadAsStringAsync();
    Assert.AreEqual("Hello World", result);
  }
}
