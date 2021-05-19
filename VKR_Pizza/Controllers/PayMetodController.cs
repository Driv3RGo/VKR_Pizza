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
    public class PayMetodController : ControllerBase
    {
        private readonly IDbRepos crud;
        private readonly ILogger _logger;   //Запись в лог

        public PayMetodController(IDbRepos db, ILogger<PayMetodController> logger)
        {
            crud = db;
            _logger = logger;
        }

        [HttpGet]   //Обрабатывает GET запрос
        public IEnumerable<Payment> GetAll()
        {
            try
            {
                return crud.Payments.GetList();    //Вывод всех размеров
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при выводе способов оплаты");    //Запись в лог ошибки
                return null;
            }
        }

        [HttpPost]                      //Обрабатывает Post запрос
        public async Task<IActionResult> Create([FromBody] Payment pay)
        {
            if (!ModelState.IsValid)            //Проверка на ошибки
            {
                return BadRequest(ModelState);  //Тип возвращаемого значения (Ошибка 404)
            }

            crud.Payments.Create(pay);      
            try
            {
                crud.Save();                        
                return Ok();  
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при создании способа оплаты");     //Запись в лог ошибки
                return BadRequest(ex);                                          //Ошибка 400
            }
        }

        [HttpPut("{id}")]               //Обрабатывает PUT запрос, но также и переменную, которая пишется через /
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] Payment payment)
        {
            if (!ModelState.IsValid)            //Проверка на ошибки
            {
                return BadRequest(ModelState);  //Тип возвращаемого значения (Ошибка 404)
            }

            var item = crud.Payments.GetItem(id);
            if (item == null)                    //Если не нашли
            {
                return NotFound();              //Ошибка 404, ресурс не найден
            }
            item.Name = payment.Name;              
            crud.Payments.Update(item);                    
            try
            {
                crud.Save();            //Сохраняем изменения
                return NoContent();     //Запрос прошел успешно
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при изменении способа оплаты");  //Запись в лог ошибки
                return BadRequest(ex);                                  //Ошибка 404
            }
        }

        [HttpDelete("{id}")]            //Обрабатывает DELETE запрос, но также и переменную, которая пишется через /
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (!ModelState.IsValid)    //Проверка на ошибки
            {
                return BadRequest(ModelState);      //Тип возвращаемого значения (Ошибка 400)
            }
            var item = crud.Payments.GetItem(id);   //Поиск по id
            if (item == null)                       //Такого Id нет
            {
                return NotFound();                  //Ошибка 404, ресурс не найден
            }
            crud.Payments.Delete(id);               //Удаляем по id
            try
            {
                crud.Save();                        //Сохраняем изменения
                return NoContent();                 //Запрос прошел успешно
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при удалении способа оплаты");    //Запись в лог ошибки
                return BadRequest(ex);                                  //Ошибка 400
            }
        }
    }
}
