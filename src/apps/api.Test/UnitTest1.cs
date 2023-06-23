

using Microsoft.AspNetCore.Mvc.Testing;

namespace Api.BackendTests;

public class HelloWorld
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
    Assert.That(result, Is.EqualTo("Hello World"));
  }
}
