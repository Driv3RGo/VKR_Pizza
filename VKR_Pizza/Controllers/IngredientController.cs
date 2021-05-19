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
    [ApiController]                 //Позволяет использовать ряд дополнительных возможностей
    public class IngredientController : ControllerBase
    {
        private readonly IDbRepos crud;
        private readonly ILogger _logger;   //Запись в лог

        public IngredientController(IDbRepos db, ILogger<IngredientController> logger)
        {
            crud = db;
            _logger = logger;
        }

        [HttpGet]                   //Обрабатывает GET запрос
        public IEnumerable<Ingredient> GetAll()
        {
            try
            {
                return crud.Ingredients.GetList();  //Вывод всех ингредиентов
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при выводе ингредиента");  //Запись в лог ошибки
                return null;
            }
        }

        [HttpPost]                      //Обрабатывает Post запрос
        public async Task<IActionResult> Create([FromBody] Ingredient ing)
        {
            if (!ModelState.IsValid)            //Проверка на ошибки
            {
                return BadRequest(ModelState);
            }
            ing.Picture = ing.Picture.ToLower();
            crud.Ingredients.Create(ing);
            try
            {
                crud.Save();
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при создании ингредиента");
                return BadRequest(ex);
            }
        }

        [HttpPut("{id}")]               //Обрабатывает PUT запрос, но также и переменную, которая пишется через /
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] Ingredient ing)
        {
            if (!ModelState.IsValid)            //Проверка на ошибки
            {
                return BadRequest(ModelState);
            }

            var item = crud.Ingredients.GetItem(id);
            if (item == null)
            {
                return NotFound();
            }
            item.Name = ing.Name;
            item.Price = ing.Price;
            item.Massa = ing.Massa;
            item.availability = ing.availability;
            item.Kategori_FK = ing.Kategori_FK;
            crud.Ingredients.Update(item);
            try
            {
                crud.Save();
                return Ok(item.Picture);     //Запрос прошел успешно
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при изменении ингредиента");
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
            var item = crud.Ingredients.GetItem(id);
            if (item == null)
            {
                return NotFound();
            }
            crud.Ingredients.Delete(id);
            try
            {
                crud.Save();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при удалении ингредиента");
                return BadRequest(ex);
            }
        }
    }
}
