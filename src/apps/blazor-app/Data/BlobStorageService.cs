using Azure.Storage.Blobs;

namespace BlazorApp.Data
{
  public class BlobStorageService
  {
    private readonly string? _connectionString;

    public BlobStorageService(IConfiguration configuration)
    {
      _connectionString = configuration.GetConnectionString("AzureBlobStorage");
    }

    public async Task<byte[]> GetImageBytes(string containerName, string blobName)
    {
      if (_connectionString == null)
      {
        // Handle the case where the connection string is not provided
        throw new Exception("AzureBlobStorage connection string is not configured.");
      }

      BlobServiceClient blobServiceClient = new BlobServiceClient(_connectionString);
      BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient(containerName);
      BlobClient blobClient = containerClient.GetBlobClient(blobName);

      using (MemoryStream memoryStream = new MemoryStream())
      {
        await blobClient.DownloadToAsync(memoryStream);
        return memoryStream.ToArray();
      }
    }

    public async Task<string> GetSvgContent(string containerName, string blobName)
    {
      if (_connectionString == null)
      {
        // Handle the case where the connection string is not provided
        throw new Exception("AzureBlobStorage connection string is not configured.");
      }

      BlobServiceClient blobServiceClient = new BlobServiceClient(_connectionString);
      BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient(containerName);
      BlobClient blobClient = containerClient.GetBlobClient(blobName);

      using (MemoryStream memoryStream = new MemoryStream())
      {
        await blobClient.DownloadToAsync(memoryStream);
        memoryStream.Position = 0;

        using (StreamReader reader = new StreamReader(memoryStream))
        {
          return await reader.ReadToEndAsync();
        }
      }
    }

  }
}