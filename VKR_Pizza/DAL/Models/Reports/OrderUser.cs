using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VKR_Pizza.DAL.Models.Reports
{
    public class OrderUser
    {
        public int Order_Id { get; set; }      //Id заказа
        public string Date { get; set; }       //Дата заказа
        public decimal Count { get; set; }     //Количество товара
        public decimal Price { get; set; }     //Сумма
        public string Status { get; set; }     //Статус заказа
        public bool dateEnd { get; set; }      //Проверка выполнен заказ или нет
        public List<ProductUser> Sostav { get; set; }//Состав заказа
    }

    public class ProductUser
    {
        public string Name { get; set; }    //Наименование пиццы
        public int Size { get; set; }    //Размер
        public decimal Price { get; set; }  //Цена пиццы
        public int Count { get; set; }  //Количество
    }

    public class OrderModer
    {
        public int Order_Id { get; set; }      //Id заказа
        public string Date { get; set; }       //Дата заказа
        public decimal Price { get; set; }     //Сумма
        public string Pay { get; set; }        //Способ оплаты
        public string Address { get; set; }    //Адрес доставки
        public string Message { get; set; }    //Комментарий к заказу
        public string Status { get; set; }     //Статус заказа
        public int Status_FK { get; set; }  //Статус заказа id
        public string Moder_FK { get; set; }   //Модератор id
        public List<ProductModer> Sostav { get; set; }//Состав заказа
    }

    public class ProductModer
    {
        public string Name { get; set; }    //Наименование пиццы
        public int Size { get; set; }       //Размер
        public decimal Price { get; set; }  //Цена пиццы
        public int Count { get; set; }      //Количество
        public string Message { get; set; } //Состав пиццы

    }
}
