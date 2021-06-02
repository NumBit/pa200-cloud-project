using System;

namespace core_api.Model
{
    public class CreateVignette
    {
        public CreateVignette() { }

        public string ecv { get; set; }
        public DateTime ValidFrom { get; set; }
        public int ValidDays { get; set; }
    }
}