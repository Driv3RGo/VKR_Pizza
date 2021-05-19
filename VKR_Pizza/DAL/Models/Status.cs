using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VKR_Pizza.DAL.Models
{
    public class Status
    {
        public Status()
        {
            Orders = new HashSet<Order>();
        }

        [Key]                               //Первичный ключ
        public int StatusId { get; set; }   //Id статуса

        [Required]                          //Поле является обязательным
        [StringLength(50)]                  //Длина поля
        public string Name { get; set; }    //Название статуса

        public virtual ICollection<Order> Orders { get; set; }
    }
}
