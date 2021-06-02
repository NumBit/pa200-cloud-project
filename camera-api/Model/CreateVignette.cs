using System;

namespace camera_api.Model
{
    public class CreateVignette
    {
        public CreateVignette() { }

        public string ecv { get; set; }
        public DateTime ValidFrom { get; set; }
        public int ValidDays { get; set; }
    }
}