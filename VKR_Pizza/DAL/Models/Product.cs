using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VKR_Pizza.DAL.Models
{
    public class Product
    {
        public Product()
        {
            Compositions = new HashSet<Composition>();
            Order_lines = new HashSet<Order_line>();
        }

        [Key]                               //Первичный ключ
        public int ProductID { get; set; }  //Id пиццы

        [Required]                          //Поле является обязательным
        [StringLength(100)]                 //Длина поля
        public string Name { get; set; }    //Название пиццы

        public decimal Price { get; set; }  //Цена пиццы

        public string Picture { get; set; } //Картинка пиццы

        public virtual ICollection<Composition> Compositions { get; set; }  //Состав пиццы

        public virtual ICollection<Order_line> Order_lines { get; set; }
    }
}
