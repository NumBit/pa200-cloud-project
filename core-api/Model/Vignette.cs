using System;
using Microsoft.Azure.Cosmos.Table;

namespace core_api.Model
{
    public class Vignette : TableEntity
    {
        public Vignette() { }

        public Vignette(string ecv, string order)
        {
            PartitionKey = ecv;
            RowKey = order;
        }

        public DateTime ValidFrom {get; set;}
        public int ValidDays {get; set;}
    }
}