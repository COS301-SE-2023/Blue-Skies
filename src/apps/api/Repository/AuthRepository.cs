using System.Net;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Text.Json;

namespace Api.Repository;

public class AuthRepository
{
  public async Task<bool> updateLoggedin(int id)
  {
    try
    {
      var client = new HttpClient();
      var request = new HttpRequestMessage(
          HttpMethod.Patch,
          "http://localhost:3333/api/auth/lastLoggedin/" + id
      );
      var response = await client.SendAsync(request);
      if (response.StatusCode == HttpStatusCode.OK)
      {
        Console.WriteLine(".NET: updated last logged in");
        return true;
      }

      Console.WriteLine(".NET: Could not update last logged in");
      return false;
    }
    catch (Exception)
    {
      Console.WriteLine(".NET: Could not update last logged in");
      throw new Exception("Could not check email");
    }
  }

  public async Task<bool> checkemail(string email)
  {
    try
    {
      var client = new HttpClient();
      var request = new HttpRequestMessage(
          HttpMethod.Get,
          "http://localhost:3333/api/auth/checkemail"
      );
      var content = new StringContent(
          "{\r\n    \"email\" : \"" + email + "\"\r\n}",
          null,
          "application/json"
      );
      request.Content = content;
      var response = await client.SendAsync(request);
      if (response.StatusCode == HttpStatusCode.OK)
      {
        Console.WriteLine(".NET: checked email");
        return true;
      }

      Console.WriteLine(".NET: Could not check email");
      return false;
    }
    catch (Exception)
    {
      Console.WriteLine(".NET: Could not check email");
      throw new Exception("Could not check email");
    }
  }

  public async Task<bool> register(string email, string password)
  {
    try
    {
      string hashed = hashpassword(password);
      var client = new HttpClient();
      var request = new HttpRequestMessage(
          HttpMethod.Post,
          "http://localhost:3333/api/auth/register"
      );
      var content = new StringContent(
          "{\r\n    \"email\" : \""
              + email
              + "\",\r\n    \"password\" : \""
              + hashed
              + "\",\r\n    \"userRole\" : 0\r\n}",
          null,
          "application/json"
      );
      request.Content = content;
      var response = await client.SendAsync(request);
      if (response.StatusCode == HttpStatusCode.OK)
      {
        Console.WriteLine(".NET: registered user");
        return true;
      }

      Console.WriteLine(".NET: Could not register user");
      return false;
    }
    catch (Exception)
    {
      Console.WriteLine(".NET: Could not register user");
      throw new Exception("Could not register user");
    }
  }

  //Login a user
  public async Task<Users> login(string email, string password)
  {
    try
    {
      string hashed = hashpassword(password);
      Console.WriteLine(".NET: login password hashed");
      var client = new HttpClient();
      var request = new HttpRequestMessage(
          HttpMethod.Get,
          "http://localhost:3333/api/auth/login"
      );
      var content = new StringContent(
          "{\r\n    \"email\" : \""
              + email
              + "\",\r\n    \"password\" : \""
              + hashed
              + "\"\r\n}",
          null,
          "application/json"
      );
      request.Content = content;
      var response = await client.SendAsync(request);


      if (response.StatusCode == HttpStatusCode.OK)
      {
        var data = await response.Content.ReadAsStringAsync();
        Users? user = null;
        if (data != null)
        {
          user = JsonSerializer.Deserialize<Users>(data);
          if (user == null) throw new Exception("Could not login user");
          await updateLoggedin(user.userId);
          Console.WriteLine(".NET: login successful");
          return user;
        }
      }

      Console.WriteLine(".NET: Could not login user");
      return new Users()
      {
        userId = -1,
        email = "No email",
        password = "No password",
        dateCreated = new DateTime(),
        lastLoggedIn = new DateTime(),
        userRole = -1
      };
    }
    catch (Exception)
    {
      Console.WriteLine(".NET: Could not login user");
      throw new Exception("Could not login user");
    }
  }

  string hashpassword(string password)
  {
    //Hash password
    int test = 123456789;
    //Convert test to byte array
    byte[] salt = BitConverter.GetBytes(test);
    string hashed = Convert.ToBase64String(
        KeyDerivation.Pbkdf2(
            password: password!,
            salt: salt,
            prf: KeyDerivationPrf.HMACSHA256,
            iterationCount: 100000,
            numBytesRequested: 256 / 8
        )
    );
    Console.WriteLine(".NET: hashed password");
    return hashed;
  }
}

//Create a hash password function
