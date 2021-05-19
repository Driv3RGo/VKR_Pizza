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
using Microsoft.AspNetCore.Authorization;

namespace VKR_Pizza.Controllers
{
    [Route("api/[controller]")]     //Текущий маршрут к контроллеру
    [ApiController]                 //Позволяет использовать ряд дополнительных возможностей
    public class ProductController : ControllerBase
    {
        private readonly IDbRepos crud;
        private readonly ILogger _logger;   //Запись в лог

        public ProductController(IDbRepos db, ILogger<ProductController> logger)
        {
            crud = db;
            _logger = logger;
        }

        [HttpGet]   //Обрабатывает GET запрос
        public IEnumerable<Product> GetAll()
        {
            try
            {
                return crud.Products.GetList(); //Вывод всех продуктов
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при выводе продуктов");    //Запись в лог ошибки
                return null;
            }
        }

        [HttpGet]   //Обрабатывает GET запрос
        [Route("listImage")]
        public IEnumerable<string> GetImage()
        {
            return crud.Reports.GetImagePizza(); //Вывод название всех картинок существующих
        }

        //[Authorize(Roles = "user, admin")]    //Для добавления в корзину необходимо авторизироваться
        [HttpGet("{id}")]   //Обрабатывает Get запрос, но также и переменную, которая пишется через /
        public async Task<IActionResult> GetProduct([FromRoute] int id)
        {
            if (!ModelState.IsValid)            //Проверка на ошибки
            {
                return BadRequest(ModelState);  //Ошибка 400
            }

            var product = crud.Products.GetItem(id);    //Поиск продукта по id
            if (product == null)                //Такого Id у продуктов нет
            {
                return NotFound();              //Ошибка 404, ресурс не найден
            }
            return Ok(product);                 //Код 200, и данные о продукте
        }

        //[Authorize(Roles = "admin")]    //Для создания нужны права админа
        [HttpPost]                      //Обрабатывает Post запрос
        public async Task<IActionResult> Create([FromBody] ProductViewModel productvm)
        {
            if (!ModelState.IsValid)            //Проверка на ошибки
            {
                return BadRequest(ModelState);  //Тип возвращаемого значения (Ошибка 404)
            }
            Product product = new Product();
            product.Name = productvm.name;
            product.Price = productvm.price;
            product.Picture = productvm.picture;

            crud.Products.Create(product);      //Создаем новый продукт
            crud.Save();
            try
            {
                foreach (CompositionVM cvm in productvm.sostav)
                {
                    Composition comp = new Composition { Product_FK = product.ProductID, Ingredient_FK = cvm.id, Count = cvm.icount};
                    crud.Compositions.Create(comp);    //Создаем новую строчку состава
                }
                crud.Save();                           //Сохраняем изменения
                return CreatedAtAction("GetProduct", new { id = product.ProductID }, product);  //Ответ, с только что созданным продуктом
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при создании продукта");   //Запись в лог ошибки
                return BadRequest(ex);                                  //Ошибка 400
            }
        }

        //[Authorize(Roles = "admin")]    //Для редактирования нужны права админа
        [HttpPut("{id}")]               //Обрабатывает PUT запрос, но также и переменную, которая пишется через /
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] ProductViewModel productvm)
        {
            if (!ModelState.IsValid)            //Проверка на ошибки
            {
                return BadRequest(ModelState);  
            }

            var item = crud.Products.GetItem(id);//Ищем продукт, который хотим изменить   
            if (item == null)                    //Если не нашли
            {
                return NotFound();              
            }
            item.Name = productvm.name;           //Новое название
            item.Price = productvm.price;         //Новая цена
            crud.Products.Update(item);           //Обновляем данные о продукте
            foreach (Composition c in item.Compositions)
            {
                bool flag = false;
                foreach(CompositionVM cvm in productvm.sostav)
                {
                    if(c.Ingredient_FK == cvm.id)
                    {
                        if(c.Count == cvm.icount)
                            productvm.sostav.Remove(cvm);
                        else
                        {
                            c.Count = cvm.icount;           //Изменяем количество
                            crud.Compositions.Update(c);    //Обновляем элемент
                        }
                        flag = true;
                        break;
                    }
                }
                if (!flag)
                    crud.Compositions.Delete(c.ID);         //В новом составе такого элемента нет, значит удаляем
            }
            foreach (CompositionVM cvm in productvm.sostav)
            {
                Composition composition = new Composition();
                composition.Product_FK = item.ProductID;
                composition.Ingredient_FK = cvm.id;
                composition.Count = cvm.icount;
                crud.Compositions.Create(composition);
            }
            try
            {
                crud.Save();            //Сохраняем изменения
                return Ok(item.Picture);//Запрос прошел успешно
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при изменении продукта");  //Запись в лог ошибки
                return BadRequest(ex);                                  
            }
        }

        //[Authorize(Roles = "admin")]    //Для удаления нужны права админа
        [HttpDelete("{id}")]            //Обрабатывает DELETE запрос, но также и переменную, которая пишется через /
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (!ModelState.IsValid)    //Проверка на ошибки
            {
                return BadRequest(ModelState);      //Тип возвращаемого значения (Ошибка 400)
            }
            var item = crud.Products.GetItem(id);   //Поиск продукта по id
            if (item == null)                       //Такого Id у продуктов нет
            {
                return NotFound();                  //Ошибка 404, ресурс не найден
            }
            crud.Products.Delete(id);               //Удаляем продукт по id
            try
            {
                crud.Save();                        //Сохраняем изменения
                return NoContent();                 //Запрос прошел успешно
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при выводе продуктов");    //Запись в лог ошибки
                return BadRequest(ex);                                  //Ошибка 400
            }
        }
    }
}
