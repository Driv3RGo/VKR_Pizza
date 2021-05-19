using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace VKR_Pizza.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageUploadController : ControllerBase
    {
        public static IWebHostEnvironment _enviroment;
        public ImageUploadController(IWebHostEnvironment environment)
        {
            _enviroment = environment;
        }

        public class FileUploadAPI
        {
            public IFormFile file1 { get; set; }
            public IFormFile file2 { get; set; }
            public string nameFile { get; set; }
        }

        [HttpPost]
        [Route("kategoriImg")]
        public async Task<IActionResult> PostKategori([FromForm]FileUploadAPI objFile)
        {
            try
            {
                createImage(objFile, "\\image\\kategori\\", "");
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("ingredientImg")]
        public async Task<IActionResult> PostIng([FromForm] FileUploadAPI objFile)
        {
            try
            {
                createImage(objFile, "\\image\\ing\\", "\\image\\ing_create\\");
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("productImg")]
        public async Task<IActionResult> PostProduct([FromForm] FileUploadAPI objFile)
        {
            try
            {
                createImage(objFile, "\\image\\product\\", "");
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        private void createImage(FileUploadAPI objFile, string path1, string path2)
        {
            string name = "";
            if (objFile.nameFile != null)
                name = objFile.nameFile;
            else name = objFile.file1.FileName.ToLower();
            if (objFile.file1 != null)
            {
                if (objFile.file1.Length > 0)
                {
                    DirectoryInfo my = new DirectoryInfo(_enviroment.WebRootPath + path1);
                    foreach (var file in my.GetFiles())
                    {
                        if (file.Name == name)
                        {
                            file.Delete();
                            break;
                        }
                    }
                    using (FileStream fileStream = System.IO.File.Create(_enviroment.WebRootPath + path1 + name))
                    {
                        objFile.file1.CopyTo(fileStream);
                        fileStream.Flush();
                    }
                }
            }
            if (objFile.file2 != null && path2 != "")
            {
                if (objFile.file2.Length > 0)
                {
                    DirectoryInfo my = new DirectoryInfo(_enviroment.WebRootPath + path2);
                    foreach (var file in my.GetFiles())
                    {
                        if (file.Name == name)
                        {
                            file.Delete();
                            break;
                        }
                    }
                    using (FileStream fileStream = System.IO.File.Create(_enviroment.WebRootPath + path2 + name))
                    {
                        objFile.file2.CopyTo(fileStream);
                        fileStream.Flush();
                    }
                }
            }
        }
    }
}
