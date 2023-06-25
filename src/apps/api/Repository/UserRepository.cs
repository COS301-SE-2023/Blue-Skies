using System.Net;
using System.Text.Json;

namespace Api.Repository;

//Create class
public class UsersRepository
{
    public async Task<List<Users>> GetAllUsers()
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Get,
                "http://localhost:3333/api/user/all"
            );
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadAsStringAsync();
                var systems = JsonSerializer.Deserialize<List<Users>>(data);
                if (systems != null)
                {
                    return systems;
                }
                return new List<Users>();
            }
            else
            {
                Console.WriteLine("Error");
                return new List<Users>();
            }
        }
        catch (Exception e)
        {
            throw new Exception("Database Connection Error:" + e.Message);
        }
    }

    public async Task<Users> updateUsers(
        int id,
        string email,
        string password,
        int userRole,
        DateTime dateCreated,
        DateTime lastLoggedIn
    )
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Patch,
                "http://localhost:3333/api/user/update/" + id
            );
            var content = new StringContent(
                "{\r\n"
                    + "\"email\" : \""
                    + email
                    + "\",\r\n"
                    + "\"password\" : \""
                    + password
                    + "\",\r\n"
                    + "\"userRole\" : "
                    + userRole
                    + "\r\n}",
                null,
                "application/json"
            );
            request.Content = content;
            var response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                Users user = new Users();
                user.userId = id;
                user.email = email;
                user.password = password;
                user.userRole = userRole;
                user.dateCreated = dateCreated;
                user.lastLoggedIn = lastLoggedIn;
                return user;
            }
            else
            {
                throw new Exception("Could not update User");
            }
        }
        catch (Exception e)
        {
            throw new Exception("Database Error: " + e.Message);
        }
    }

    //Delete User
    public async Task<bool> deleteUsers(int id)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Delete,
                "http://localhost:3333/api/user/delete/" + id
            );
            var response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                return true;
            }
            //Check Status code
            else if (response.StatusCode == HttpStatusCode.NotFound)
            {
                return false;
            }
            else
            {
                throw new Exception("Could not delete User");
            }
        }
        catch (Exception e)
        {
            throw new Exception("Database Error: " + e.Message);
        }
    }

    //Get User by id
    public async Task<Users> getUserById(int id)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Get,
                "http://localhost:3333/api/user/" + id
            );
            var response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadAsStringAsync();
                //Console.WriteLine(data);
                var app = JsonSerializer.Deserialize<Users>(data);
                if (app != null)
                {
                    return app;
                }
                return new Users();
            }
            else
            {
                //return empty list
                Console.WriteLine("Error");
                throw new Exception("Could not get User");
            }
        }
        catch (Exception e)
        {
            throw new Exception("Database Error: " + e.Message);
        }
    }
}
