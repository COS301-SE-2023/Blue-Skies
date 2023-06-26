using System.Net;
using System.Text.Json;

namespace Api.Repository;

//Create class
public class KeysRepository
{
    //Get all keys
    public async Task<List<Keys>> GetAllKeys()
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Get,
                "http://localhost:3333/api/key/all"
            );
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadAsStringAsync();
                var systems = JsonSerializer.Deserialize<List<Keys>>(data);
                if (systems != null)
                {
                    return systems;
                }
                return new List<Keys>();
            }
            else
            {
                //return empty list
                Console.WriteLine("Error");
                return new List<Keys>();
            }
        }
        catch (Exception e)
        {
            throw new Exception("Database Connection Error");
        }
    }

    //Create key
    public async Task<Keys> CreateKey(string owner, int remainingCalls, int suspended)
    {
        try
        {
            string APIKey = Guid.NewGuid().ToString();
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Post,
                "http://localhost:3333/api/key/create"
            );
            var content = new StringContent(
                "{\r\n    \"owner\": \""
                    + owner
                    + "\",\r\n    \"APIKey\" : \""
                    + APIKey
                    + "\",\r\n    \"remainingCalls\" : "
                    + remainingCalls
                    + "\r\n}",
                null,
                "application/json"
            );
            request.Content = content;
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                Keys ans = new Keys();
                ans.owner = owner;
                ans.APIKey = APIKey;
                ans.remainingCalls = remainingCalls;
                ans.suspended = suspended;
                return ans;
            }
            else
            {
                //return empty list
                Console.WriteLine("Error");
                return new Keys();
            }
        }
        catch (Exception e)
        {
            throw new Exception("Database Connection Error");
        }
    }

    //Delete Key
    public async Task<bool> deleteKeys(int id)
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Delete,
                "http://localhost:3333/api/key/delete/" + id
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
                throw new Exception("Could not delete Key");
            }
        }
        catch (Exception e)
        {
            throw new Exception("Database Error: " + e.Message);
        }
    }

    // Update Key
    public async Task<Keys> updateKeys(
        int id,
        string owner,
        string APIKey,
        int remainingCalls,
        int suspended
    )
    {
        try
        {
            var client = new HttpClient();
            var request = new HttpRequestMessage(
                HttpMethod.Patch,
                "http://localhost:3333/api/key/update/" + id
            );
            var content = new StringContent(
                "{\r\n "
                    + "\"owner\" : \""
                    + owner
                    + "\",\r\n"
                    + "\"APIKey\" : \""
                    + APIKey
                    + "\",\r\n"
                    + "\"remainingCalls\" : "
                    + remainingCalls
                    + ",\r\n"
                    + "\"suspended\" : "
                    + suspended
                    + "\r\n}",
                null,
                "application/json"
            );
            request.Content = content;
            var response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                Keys key = new Keys();
                key.keyId = id;
                key.owner = owner;
                key.APIKey = APIKey;
                key.remainingCalls = remainingCalls;
                key.suspended = suspended;
                return key;
            }
            else
            {
                throw new Exception("Could not update Key");
            }
        }
        catch (Exception e)
        {
            throw new Exception("Database Error: " + e.Message);
        }
    }
}
