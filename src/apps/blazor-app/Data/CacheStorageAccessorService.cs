using Microsoft.JSInterop;

public class CacheStorageAccessor : IAsyncDisposable
{
    private Lazy<IJSObjectReference> _accessorJsRef = new();
    private readonly IJSRuntime _jsRuntime;

    public CacheStorageAccessor(IJSRuntime jsRuntime)
    {
        _jsRuntime = jsRuntime;
    }

    private async Task WaitForReference()
    {
        if (_accessorJsRef.IsValueCreated is false)
        {
            _accessorJsRef = new(await _jsRuntime.InvokeAsync<IJSObjectReference>("import", "/js/CacheStorageAccessor.js"));
        }
    }

    public async ValueTask DisposeAsync()
    {
        if (_accessorJsRef.IsValueCreated)
        {
            await _accessorJsRef.Value.DisposeAsync();
        }
    }
    public async Task StoreAsync(HttpRequestMessage requestMessage, HttpResponseMessage responseMessage)
    {
        await WaitForReference();
        string requestMethod = requestMessage.Method.Method;
        string requestBody = await GetRequestBodyAsync(requestMessage);
        string responseBody = await responseMessage.Content.ReadAsStringAsync();
        await _accessorJsRef.Value.InvokeVoidAsync("store", requestMessage.RequestUri, requestMethod, requestBody, responseBody);
    }

    public async Task<string> GetAsync(HttpRequestMessage requestMessage)
    {
        await WaitForReference();
        string requestMethod = requestMessage.Method.Method;
        Console.WriteLine(requestMethod);
        string requestBody = await GetRequestBodyAsync(requestMessage);
        string result = await _accessorJsRef.Value.InvokeAsync<string>("get", requestMessage.RequestUri, requestMethod, requestBody);
        return result;
    }

    public async Task RemoveAsync(HttpRequestMessage requestMessage)
    {
        await WaitForReference();
        string requestMethod = requestMessage.Method.Method;
        string requestBody = await GetRequestBodyAsync(requestMessage);
        await _accessorJsRef.Value.InvokeVoidAsync("remove", requestMessage.RequestUri, requestMethod, requestBody);
    }

    public async Task RemoveAllAsync()
    {
        await WaitForReference();
        await _accessorJsRef.Value.InvokeVoidAsync("removeAll");
    }

    private static async Task<string> GetRequestBodyAsync(HttpRequestMessage requestMessage)
    {
        string requestBody = "";

        if (requestMessage.Content is not null)
        {
            requestBody = await requestMessage.Content.ReadAsStringAsync() ?? "";
        }

        return requestBody;
    }
}