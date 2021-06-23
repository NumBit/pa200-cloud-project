using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using core_api.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;

namespace core_api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BlobPicturesController : ControllerBase
    {
        private string connectionString = AppSettings.LoadAppSettings().StorageConnectionString;
        private string containerName = "camera-photos";

        private readonly ILogger<BlobPicturesController> _logger;

        [HttpGet]
        public async Task<IEnumerable<BlobItem>> GetListOfPhotos()
        {
            BlobContainerClient client = new BlobContainerClient(connectionString, containerName);

            var blobs = new List<BlobItem>();
            await foreach (var blob in client.GetBlobsAsync())
            {
                blobs.Add(blob);
                Console.WriteLine(blob);
            }
            return blobs;
        }

        [HttpGet("/{fileName}")]
        public async Task<Uri> GetBlobLink(string fileName)
        {
            BlobClient client = new BlobClient(connectionString, containerName, fileName);
            if (!await client.ExistsAsync()) return null;


            if (!client.CanGenerateSasUri)
            {
                Console.WriteLine(@"BlobContainerClient must be authorized with Shared Key 
                                credentials to create a service SAS.");
                return null;
            }
            // Create a SAS token that's valid for one hour.
            BlobSasBuilder sasBuilder = new BlobSasBuilder()
            {
                Resource = "b",
            };

            sasBuilder.ExpiresOn = DateTimeOffset.UtcNow.AddHours(1);
            sasBuilder.SetPermissions((BlobContainerSasPermissions.Read));


            Uri sasUri = client.GenerateSasUri(sasBuilder);
            Console.WriteLine("SAS URI for blob container is: {0}", sasUri);
            Console.WriteLine();
            return sasUri;
        }


    }
}