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
using VKR_Pizza.Service;
using Microsoft.AspNetCore.Identity;

namespace VKR_Pizza.Controllers
{
    [Route("api/[controller]")]     //Текущий маршрут к контроллеру
    [ApiController]                 //Позволяет использовать ряд дополнительных возможностей
    public class OrderController : ControllerBase
    {
        private readonly IDbRepos crud;
        private readonly ILogger _logger;   //Запись в лог
        private readonly UserManager<User> _userManager;        

        public OrderController(IDbRepos db, UserManager<User> userManager, ILogger<OrderController> logger)
        {
            crud = db;
            _userManager = userManager;
            _logger = logger;
        }

        [HttpGet]   //Обрабатывает GET запрос
        public async Task<IActionResult> GetAll()
        {     
            try
            {
                var order = crud.Reports.GetOrderNewDate();
                var status = crud.Statuses.GetList();
                var msg = new
                {
                    order,
                    status
                };
                return Ok(msg);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при выводе заказов");    
                return null;
            }
        }

        [HttpGet]
        [Route("GetOrderUser")]
        public async Task<IActionResult> GetOrderUser()     //Список заказов пользователя
        {
            User usr = await _userManager.GetUserAsync(HttpContext.User);
            if (usr != null)
                return Ok(crud.Reports.GetOrderUser(usr.Id));
            else return Ok();
        }

        [HttpGet("{id}")]   //Обрабатывает Get запрос, но также и переменную, которая пишется через /
        public async Task<IActionResult> GetOrder([FromRoute] int id)
        {
            if (!ModelState.IsValid)            //Проверка на ошибки
            {
                return BadRequest(ModelState);  //Тип возвращаемого значения (Ошибка 400)
            }
            var order = crud.Orders.GetItem(id);  //Поиск заказа по id
            if (order == null)      //Заказов нет
            {
                return NotFound();  //Ошибка 404, ресурс не найден
            }
            return Ok(order);       //Код 200, и заказы для данного пользователя
        }

        [HttpPost]                              //Обрабатывает Post запрос
        public async Task<IActionResult> Create([FromBody] OrderViewModel ordervm)
        {
            if (!ModelState.IsValid)            //Проверка на ошибки
            {
                return BadRequest(ModelState);  //Тип возвращаемого значения (Ошибка 400)
            }

            Order order = new Order();
            order.DataBegin = DateTime.Now;     //Дата принятия заказа = текущей дате и времени компьютера
            order.User_FK = ordervm.User_FK;
            order.Price = ordervm.Price;
            order.Status_FK = 1;
            order.Payment_FK = ordervm.Payment_FK;
            order.Address = ordervm.Address;
            order.Message = ordervm.Message;

            crud.Orders.Create(order);          //Создаем новую строчку заказа
            try
            {
                string sostav = "";             //html код для состава заказа
                crud.Save();                    //Сохраняем изменения
                foreach(OrderlineVM ovm in ordervm.sostav)
                {
                    string ing = "";
                    if(ovm.ing != null)
                    {
                        foreach(IngVM ivm in ovm.ing)
                        {
                            ing += ivm.name + " x" + ivm.icount + ",";
                        }
                        ing.Substring(ing.Length - 1, 1);
                    }
                    Order_line ol = new Order_line { Order_FK = order.OrderID, Product_FK = ovm.pId, Count = ovm.k, Price = ovm.price, Size_FK = ovm.sId, Message = ing };
                    crud.Order_lines.Create(ol);    //Создаем новую строчку заказа
                    sostav += "<tr>";
                    sostav += "<td style=\"background-color:rgba(255, 255, 255, 0.8); border-bottom-color:#dddddd;border-bottom-style:solid;border-bottom-width:1px;border-right-color:#dddddd;border-right-style:solid;border-right-width:1px;font-size:12px;padding:12px;text-align:left\">";
                    sostav += "<a href = \"#\" style =\"color:#000;font-size:14px;font-weight:600\">";
                    sostav += crud.Products.GetItem(ol.Product_FK).Name + "</a></td>"; 
                    sostav += "<td style=\"background-color:rgba(255, 255, 255, 0.8); border-bottom-color:#dddddd;border-bottom-style:solid;border-bottom-width:1px;border-right-color:#dddddd;border-right-style:solid;border-right-width:1px;font-size:12px;padding:12px;text-align:left\">";
                    sostav += crud.SizePizzas.GetItem(ol.Size_FK).Size + "<span> см.</span></td>"; 
                    sostav += "<td style =\"background-color:rgba(255, 255, 255, 0.8); border-bottom-color:#dddddd;border-bottom-style:solid;border-bottom-width:1px;border-right-color:#dddddd;border-right-style:solid;border-right-width:1px;font-size:12px;padding:12px;text-align:right\">";
                    sostav += ol.Count + "</td>";
                    sostav += "<td style =\"background-color:rgba(255, 255, 255, 0.8); border-bottom-color:#dddddd;border-bottom-style:solid;border-bottom-width:1px;border-right-color:#dddddd;border-right-style:solid;border-right-width:1px;font-size:12px;padding:12px;text-align:right\">";
                    sostav += ol.Price + "<span> руб.</span></td>"; 
                    sostav += "<td style =\"background-color:rgba(255, 255, 255, 0.8); border-bottom-color:#dddddd;border-bottom-style:solid;border-bottom-width:1px;border-right-color:#dddddd;border-right-style:solid;border-right-width:1px;font-size:12px;padding:12px;text-align:right\">";
                    sostav += (ol.Count * ol.Price) + "<span> руб.</span></td></tr>";       
                }
                crud.Save();                    //Сохраняем изменения

                User usr = await _userManager.FindByIdAsync(ordervm.User_FK);   //Поиск пользователя по id
                usr.Bonus = Convert.ToInt32(order.Price) / 100;                 //Каждый 100 рублей 1 бонус
                await _userManager.UpdateAsync(usr);
                EmailService emailService = new EmailService();
                await emailService.SendEmailAsync(usr.Email, "Доставка пиццы - Заказ №" + order.OrderID, CreateEmail(order, usr, sostav));

                return CreatedAtAction("GetOrder", new { id = order.OrderID }, order);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при создании заказа"); //Запись в лог ошибки
                return BadRequest(ex);                              //Ошибка 400
            }
        }

        private string CreateEmail(Order ovm, User user, string sostav)
        {
            string str = "";
            str += "<div style=\"background:#f8f8f8;color:#000000;font-family:'arial' , 'helvetica' , sans-serif;font-size:13px;padding:30px;text-align:center;width:680px\">";
            str += "<div style=\"width:680px\">";
            str += "<p style=\"color:#000;font-size:18px;margin-bottom:20px;margin-top:0px\">";
            str += "Благодарим за интерес к нашим товарам.Ваш заказ получен и будет приготовлен в ближайшее время</p>";
            str += "<table style=\"border-collapse:collapse;border-left-color:#dddddd;border-left-style:solid;border-left-width:1px;border-top-color:#dddddd;border-top-style:solid;border-top-width:1px;margin-bottom:20px;width:100%\">";
            str += "<thead><tr>";
            str += "<td colspan = \"2\" style=\"background-color:#ef7f1a;border-bottom-color:#dddddd;border-bottom-style:solid;border-bottom-width:1px;border-right-color:#dddddd;border-right-style:solid;border-right-width:1px;color:#fff;font-size:12px;font-weight:bold;padding:12px;text-align:left\">";
            str += "Детализация заказа</td></tr></thead><tbody><tr>";
            str += "<td style=\"background-color:rgba(255, 255, 255, 0.8);border-bottom-color:#dddddd;border-bottom-style:solid;border-bottom-width:1px;border-right-color:#dddddd;border-right-style:solid;border-right-width:1px;font-size:12px;padding:12px;text-align:left;width:50%\">";
            str += "<b>№ заказа:</b> "+ ovm.OrderID +" <br>";
            str += "<b> Дата заказа:</b> "+ ovm.DataBegin.ToString("yyyy.MM.dd, HH:mm:ss")+" <br>";
            str += "<b> Способ оплаты:</b> "+ crud.Payments.GetItem(ovm.Payment_FK).Name + "<br>";
            str += "<b> Кол-во бонусов:</b> " + user.Bonus + "<br></td>";
            str += "<td style=\"background-color:rgba(255, 255, 255, 0.8);border-bottom-color:#dddddd;border-bottom-style:solid;border-bottom-width:1px;border-right-color:#dddddd;border-right-style:solid;border-right-width:1px;font-size:12px;padding:12px;text-align:left\">"; 
            str += "<b> E-mail:</b><a href=\"mailto: "+user.Email+"\"> "+ user.Email + " </a><br>";
            str += "<b> Телефон:</b><span> +7 "+ user.PhoneNumber +" </span><br>";
            str += "<b> Контактное лицо: </b> " + user.FIO + "<br>";
            str += "<b> Адрес доставки: </b> " + ovm.Address + "<br><br>";
            str += "<span style=\"background:#d40000;color:#fff;padding:5px 10px 5px 10px\">";
            str += "<b> Состояние заказа:</b>В Обработке</span><br></td></tr></tbody></table>";
            str += "<table style=\"border-collapse:collapse; border-left-color:#dddddd;border-left-style:solid;border-left-width:1px;border-top-color:#dddddd;border-top-style:solid;border-top-width:1px;margin-bottom:20px;width:100%\">";
            str += "<thead><tr>";
            str += "<td style=\"background-color:#ef7f1a;border-bottom-color:#dddddd;border-bottom-style:solid;border-bottom-width:1px;border-right-color:#dddddd;border-right-style:solid;border-right-width:1px;color:#fff;font-size:12px;font-weight:bold;padding:12px;text-align:left\">";
            str += "Товар</td>";
            str += "<td style=\"background-color:#ef7f1a;border-bottom-color:#dddddd;border-bottom-style:solid;border-bottom-width:1px;border-right-color:#dddddd;border-right-style:solid;border-right-width:1px;color:#fff;font-size:12px;font-weight:bold;padding:12px;text-align:left\">";
            str += "Размер</td>";
            str += "<td style=\"background-color:#ef7f1a;border-bottom-color:#dddddd;border-bottom-style:solid;border-bottom-width:1px;border-right-color:#dddddd;border-right-style:solid;border-right-width:1px;color:#fff;font-size:12px;font-weight:bold;padding:12px;text-align:right\">";
            str += "Количество</td>";
            str += "<td style=\"background-color:#ef7f1a;border-bottom-color:#dddddd;border-bottom-style:solid;border-bottom-width:1px;border-right-color:#dddddd;border-right-style:solid;border-right-width:1px;color:#fff;font-size:12px;font-weight:bold;padding:12px;text-align:right\">";
            str += "Цена</td>";
            str += "<td style=\"background-color:#ef7f1a;border-bottom-color:#dddddd;border-bottom-style:solid;border-bottom-width:1px;border-right-color:#dddddd;border-right-style:solid;border-right-width:1px;color:#fff;font-size:12px;font-weight:bold;padding:12px;text-align:right\">";
            str += "Итого:</td></tr></thead>";
            str += "<tbody>" + sostav + "</tbody>";
            str += "<tfoot><tr>";
            str += "<td colspan = \"4\" style=\"background-color:rgba(255, 255, 255, 0.8); border-bottom-color:#dddddd;border-bottom-style:solid;border-bottom-width:1px;border-right-color:#dddddd;border-right-style:solid;border-right-width:1px;font-size:12px;padding:12px;text-align:right\">";
            str += "<b> Сумма:</b></td>";
            str += "<td style=\"background-color:rgba(255, 255, 255, 0.8); border-bottom-color:#dddddd;border-bottom-style:solid;border-bottom-width:1px;border-right-color:#dddddd;border-right-style:solid;border-right-width:1px;font-size:12px;padding:12px;text-align:right\">";
            str += ovm.Price + "<span> руб.</span></td></tr></tfoot></table>";
            str += "<p style=\"color:#000;font-size:22px;font-weight:600 text-align:'center'\"> Ваш заказ уже готовится и будет доставлен в течение 60 минут.</p>";
            str += "<p style=\"color:#000;font-size:22px;font-weight:600\"> С уважением, ДОСТАВКА ПИЦЦЫ</p></div></div>";
            return str;
        }

        [HttpPut("{id}")]               //Обрабатывает PUT запрос, но также и переменную, которая пишется через /
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] Order order)
        {
            if (!ModelState.IsValid)            //Проверка на ошибки
            {
                return BadRequest(ModelState);  
            }

            var item = crud.Orders.GetItem(id);
            if (item == null)                    
            {
                return NotFound();             
            }
            item.Status_FK = order.Status_FK;
            if(item.Moder_FK == null)
                item.Moder_FK = order.Moder_FK;
            if (order.Address == "true")
                item.DataEnd = DateTime.Now;
            crud.Orders.Update(item);
            try
            {
                crud.Save();            
                return NoContent();     //Запрос прошел успешно
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при изменении заказа");  
                return BadRequest(ex);                                      
            }
        }
    }
}
