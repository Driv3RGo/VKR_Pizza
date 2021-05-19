using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VKR_Pizza.DAL.Models
{
    public class Payment
    {
        public Payment()
        {
            Orders = new HashSet<Order>();
        }

        [Key]                               //Первичный ключ
        public int PaymentId { get; set; }  //Id метода оплаты

        [Required]                          //Поле является обязательным
        [StringLength(50)]                  //Длина поля
        public string Name { get; set; }    //Наименование способа оплаты

        public virtual ICollection<Order> Orders { get; set; }
    }
}
