
#nullable enable
namespace camera_api.Model
{
    public class VignetteValidationResponse
    {
        public bool isValid { get; set; }
        public System.Uri? uploadPhotoPath { get; set; }

        public VignetteValidationResponse(bool valid, System.Uri? path)
        {
            isValid = valid;
            uploadPhotoPath = path;
        }
    }
}
