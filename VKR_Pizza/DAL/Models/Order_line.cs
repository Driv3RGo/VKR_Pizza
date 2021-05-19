using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VKR_Pizza.DAL.Models
{
    public partial class Order_line         //Строчка в заказе, разрывает связь многие ко многим
    {
        [Key]                               //Первичный ключ
        public int ID { get; set; }         //Id записи

        public int Order_FK { get; set; }   //Id заказа

        public int Product_FK { get; set; } //Id продукта

        public int Count { get; set; }      //Количества пицц данного вида

        public string Message { get; set; } //Если конструктор, сюда пишется состав

        public decimal Price { get; set; }   //Цена за 1 товар

        public int Size_FK { get; set; }     //Id размера пиццы

        public virtual Order Order { get; set; }

        public virtual Product Product { get; set; }

        public virtual SizePizza SizePizza { get; set; }  //Размер пиццы
    }
}
