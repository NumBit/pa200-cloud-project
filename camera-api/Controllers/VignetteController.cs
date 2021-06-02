using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using camera_api.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos.Table;

namespace camera_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VignetteController : ControllerBase
    {
        CloudTable table = TableStore.GetTable("vignettes");

        [HttpGet("/rng")]
        public int GetRng()
        {
            var rng = new Random();
            return rng.Next(1,100);
        }


        [HttpGet]
        public async Task<IEnumerable<Vignette>> GetAll()
        {
            var query = table.CreateQuery<Vignette>();
            TableContinuationToken token = null;
            var vignettes = new List<Vignette>();
            do
            {
                TableQuerySegment<Vignette> resultSegment = await table.ExecuteQuerySegmentedAsync(query, token);
                token = resultSegment.ContinuationToken;
                vignettes.AddRange(resultSegment.Results);
            } while (token != null);
            return vignettes;
        }

        [HttpGet("{ecv}")]
        public async Task<IEnumerable<Vignette>> GetByECV(string ecv)
        {
            return await getVignettesByEcv(ecv);
        }


        [HttpGet("checkValidVignette/{ecv}")]
        public async Task<bool> CheckValidVignette(string ecv)
        {
            var vignettes = await getVignettesByEcv(ecv);
            foreach (var vignette in vignettes)
            {
                if (vignette.ValidDays != -1 &&
                    vignette.ValidFrom <= DateTime.Now &&
                    vignette.ValidFrom.AddDays(vignette.ValidDays) >= DateTime.Now)
                {
                    return true;
                }
                if (vignette.ValidDays == -1 &&
                    vignette.ValidFrom.Year == DateTime.Now.Year)
                {
                    return true;
                }
            }
            return false;
        }

        [HttpGet("/checkRandom")]
        public async Task<bool> CheckRandom()
        {
            var ecvs = new List<String>
            {"SL123AB", "BA123AB"};
            var rng = new Random();
            var ecv = ecvs[rng.Next(0,2)];
            var vignettes = await getVignettesByEcv(ecv);
            foreach (var vignette in vignettes)
            {
                if (vignette.ValidDays != -1 &&
                    vignette.ValidFrom <= DateTime.Now &&
                    vignette.ValidFrom.AddDays(vignette.ValidDays) >= DateTime.Now)
                {
                    return true;
                }
                if (vignette.ValidDays == -1 &&
                    vignette.ValidFrom.Year == DateTime.Now.Year)
                {
                    return true;
                }
            }
            return false;
        }


        // PUT api/<ECVController>/5
        [HttpPut]
        public async Task<bool> Put([FromBody] CreateVignette vignette)
        {
            if (vignette == null)
            {
                return false;
            }
            return await createVignette(vignette);
        }

        // DELETE api/<ECVController>/5
        [HttpDelete("{ecv}/{order}")]
        public async void Delete(string ecv, string order)
        {
            if (ecv == null || order == null)
            {
                return;
            }
            TableOperation retrieve = TableOperation.Retrieve<Vignette>(ecv, order);
            var res = await table.ExecuteAsync(retrieve);
            Vignette vignette = res.Result as Vignette;
            if (vignette != null)
            {
                TableOperation delete = TableOperation.Delete(vignette);
                await table.ExecuteAsync(delete);
            }
        }

        private async Task<IEnumerable<Vignette>> getVignettesByEcv(string ecv)
        {
            TableQuery<Vignette> query = new TableQuery<Vignette>().Where(
                    TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, ecv));
            TableContinuationToken token = null;
            var vignettes = new List<Vignette>();
            do
            {
                TableQuerySegment<Vignette> resultSegment = await table.ExecuteQuerySegmentedAsync(query, token);
                token = resultSegment.ContinuationToken;
                vignettes.AddRange(resultSegment.Results);
            } while (token != null);
            return vignettes;
        }

        private async Task<bool> createVignette(CreateVignette vignette)
        {
            bool success = false;
            var vignettes = await getVignettesByEcv(vignette.ecv);
            var newVignette = new Vignette();
            newVignette.PartitionKey = vignette.ecv;
            newVignette.ValidFrom = vignette.ValidFrom;
            newVignette.ValidDays = vignette.ValidDays;
            var lastVignette = vignettes.OrderBy(v => Int32.Parse(v.RowKey)).Last();
            if (lastVignette != null)
            {
                newVignette.RowKey = (Int32.Parse(lastVignette.RowKey) + 1).ToString();
            }
            else
            {
                newVignette.RowKey = "1";
            }
            TableOperation insert = TableOperation.Insert(newVignette);
            try
            {
                await table.ExecuteAsync(insert);
                success = true;
            }
            catch
            {
                success = false;
            }
            return success;
        }

    }
}