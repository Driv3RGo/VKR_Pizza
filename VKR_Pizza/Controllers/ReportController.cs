using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using VKR_Pizza.DAL.Interfaces;
using Microsoft.AspNetCore.Identity;
using VKR_Pizza.DAL.Models;
using System;
using System.Collections.Generic;

namespace VKR_Pizza.Controllers
{
    [Produces("application/json")]
    public class ReportController : Controller
    {
        private readonly IDbRepos crud;
        private readonly UserManager<User> _userManager;        //Предоставляет API-интерфейсы для управления Пользователем в хранилище

        public ReportController(IDbRepos db, UserManager<User> userManager)
        {
            crud = db;
            _userManager = userManager;
        }

        public class DateVM
        {
            public DateTime date1 { get; set; }
            public DateTime date2 { get; set; }
        }

        public class UserVM
        {
            public string fio { get; set; }
            public string email { get; set; }
            public string phonenumber { get; set; }
            public int bonus { get; set; }
            public string role { get; set; }
            public string listrole { get; set; }
        }

        [HttpPost]
        [Route("api/Report/RaitingPizza")]
        public async Task<IActionResult> RaitingPizza([FromBody] DateVM model)   //Рейтинг пицц
        {
            return Ok(crud.Reports.GetRatingPizza(model.date1, model.date2));
        }

        [HttpPost]
        [Route("api/Report/RaitingModer")]
        public async Task<IActionResult> RaitingModer([FromBody] DateVM model)   //Рейтинг операторов
        {
            return Ok(crud.Reports.GetRatingModer(model.date1, model.date2));
        }

        [HttpPost]
        [Route("api/Report/RaitingPay")]
        public async Task<IActionResult> RaitingPay([FromBody] DateVM model)     //Рейтинг способов оплаты
        {
            return Ok(crud.Reports.GetRaitingPay(model.date1, model.date2));
        }

        [HttpPost]
        [Route("api/Report/RaitingSize")]
        public async Task<IActionResult> RaitingSize([FromBody] DateVM model)     //Рейтинг способов оплаты
        {
            return Ok(crud.Reports.GetRaitingSize(model.date1, model.date2));
        }

        [HttpPost]
        [Route("api/Report/GetOrders")]
        public async Task<IActionResult> GetOrders([FromBody] DateVM model)   //Список заказов
        {
            var orders = crud.Reports.GetOrders(model.date1, model.date2);
            bool oneMonth = false;
            bool oneYear = false;
            if (model.date1.Month == model.date2.Month)
                oneMonth = true;
            if (model.date1.Year == model.date2.Year)
                oneYear = true;
            var msg = new
            {
                orders,
                oneMonth,
                oneYear
            };
            return Ok(msg);
        }

        [HttpPost]
        [Route("api/Report/UserList")]
        public async Task<IActionResult> UserList()   //Вывод всех пользователей
        {
            var us = _userManager.Users.ToList();
            string listrole = crud.Reports.GetRoles();
            List<UserVM> response = new List<UserVM>();
            foreach(var u in us)
            {
                UserVM user = new UserVM{ fio=u.FIO, email=u.Email, phonenumber=u.PhoneNumber, bonus=u.Bonus, role= _userManager.GetRolesAsync(u).Result[0], listrole= listrole };
                response.Add(user);
            }
            return Ok(response);
        }

        [HttpPut]
        [Route("api/Report/UpdateUser")]
        public async Task<IActionResult> UpdateUser([FromBody] UserVM model)     //Изменение данных пользователя
        {
            User usr = await _userManager.FindByNameAsync(model.email);        //Поиск пользователя по почте
            usr.Bonus = model.bonus;
            string role = _userManager.GetRolesAsync(usr).Result[0];
            if (role != model.role)
            {
                await _userManager.AddToRoleAsync(usr, model.role); //Добавляем новую роль
                await _userManager.RemoveFromRoleAsync(usr, role);  //Удаляем старую роль
            }
            await _userManager.UpdateAsync(usr);                    //Обновляем данные
            return Ok();
        }

        [HttpDelete]
        [Route("api/Report/DeleteUser")]
        public async Task<IActionResult> DeleteUser([FromBody] UserVM model)     //Удаление пользователя
        {
            User usr = await _userManager.FindByNameAsync(model.email);
            await _userManager.DeleteAsync(usr);         
            return Ok();
        }
    }
}
