using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace VKR_Pizza.DAL.Models
{
    public class User : IdentityUser
    {
        public User()
        {
            Orders = new HashSet<Order>();
        }

        [Required]                          //Поле является обязательным
        [StringLength(100)]                 //Длина поля
        public string FIO { get; set; }     //ФИО пользователя

        public int Bonus { get; set; }      //Бонусы пользователя

        public virtual ICollection<Order> Orders { get; set; }
    }
}
