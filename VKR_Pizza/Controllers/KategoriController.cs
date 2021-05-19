using VKR_Pizza.DAL.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VKR_Pizza.DAL.Interfaces;
using Microsoft.Extensions.Logging;

namespace VKR_Pizza.Controllers
{
    [Route("api/[controller]")]     //Текущий маршрут к контроллеру
    [ApiController]
    public class KategoriController : ControllerBase
    {
        private readonly IDbRepos crud;
        private readonly ILogger _logger;   //Запись в лог

        public KategoriController(IDbRepos db, ILogger<PayMetodController> logger)
        {
            crud = db;
            _logger = logger;
        }

        [HttpGet]   //Обрабатывает GET запрос
        public IEnumerable<Kategori> GetAll()
        {
            try
            {
                return crud.Kategoris.GetList();  
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при выводе категорий");    //Запись в лог ошибки
                return null;
            }
        }

        [HttpPost]                      //Обрабатывает Post запрос
        public async Task<IActionResult> Create([FromBody] Kategori k)
        {
            if (!ModelState.IsValid)            //Проверка на ошибки
            {
                return BadRequest(ModelState);  
            }
            k.Picture = k.Picture.ToLower();
            crud.Kategoris.Create(k);
            try
            {
                crud.Save();
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при создании категории");     
                return BadRequest(ex);                                          
            }
        }

        [HttpPut("{id}")]               //Обрабатывает PUT запрос, но также и переменную, которая пишется через /
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] Kategori k)
        {
            if (!ModelState.IsValid)            //Проверка на ошибки
            {
                return BadRequest(ModelState);  
            }

            var item = crud.Kategoris.GetItem(id);
            if (item == null)                    
            {
                return NotFound();              
            }
            item.Name = k.Name;
            crud.Kategoris.Update(item);
            try
            {
                crud.Save();           
                return Ok(item.Picture);     
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при изменении категории");  
                return BadRequest(ex);                                  
            }
        }

        [HttpDelete("{id}")]            //Обрабатывает DELETE запрос, но также и переменную, которая пишется через /
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (!ModelState.IsValid)    //Проверка на ошибки
            {
                return BadRequest(ModelState);      
            }
            var item = crud.Kategoris.GetItem(id);   
            if (item == null)                       
            {
                return NotFound();                  
            }
            crud.Kategoris.Delete(id);               
            try
            {
                crud.Save();                        
                return NoContent();                 
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при удалении категории");    
                return BadRequest(ex);                                  
            }
        }
    }
}
