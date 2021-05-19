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
    public class StatusController : ControllerBase
    {
        private readonly IDbRepos crud;
        private readonly ILogger _logger;   //Запись в лог

        public StatusController(IDbRepos db, ILogger<StatusController> logger)
        {
            crud = db;
            _logger = logger;
        }

        [HttpGet]   //Обрабатывает GET запрос
        public IEnumerable<Status> GetAll()
        {
            try
            {
                return crud.Statuses.GetList();   
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при выводе статусов");    //Запись в лог ошибки
                return null;
            }
        }

        [HttpPost]                      //Обрабатывает Post запрос
        public async Task<IActionResult> Create([FromBody] Status status)
        {
            if (!ModelState.IsValid)            //Проверка на ошибки
            {
                return BadRequest(ModelState);  
            }

            crud.Statuses.Create(status);
            try
            {
                crud.Save();
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при создание статуса");     
                return BadRequest(ex);                                          
            }
        }

        [HttpPut("{id}")]               //Обрабатывает PUT запрос, но также и переменную, которая пишется через /
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] Status status)
        {
            if (!ModelState.IsValid)            //Проверка на ошибки
            {
                return BadRequest(ModelState);  
            }

            var item = crud.Statuses.GetItem(id);
            if (item == null)                    //Если не нашли
            {
                return NotFound();              
            }
            item.Name = status.Name;
            crud.Statuses.Update(item);
            try
            {
                crud.Save();            
                return NoContent();     
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при изменении статуса");  
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
            var item = crud.Statuses.GetItem(id); 
            if (item == null)                      
            {
                return NotFound();                  
            }
            crud.Statuses.Delete(id);             
            try
            {
                crud.Save();                        
                return NoContent();                
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при удаление статуса");    
                return BadRequest(ex);                                  
            }
        }
    }
}
