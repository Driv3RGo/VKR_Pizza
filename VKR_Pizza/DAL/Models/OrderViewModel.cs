using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VKR_Pizza.DAL.Models
{
    public class OrderViewModel
    {
        public string User_FK { get; set; }         //Id пользователя сделавшего заказ

        public int Payment_FK { get; set; }         //Id способа оплаты

        public string Address { get; set; }         //Адрес, по которому доставить заказ

        public string Message { get; set; }         //Комментарий к заказу

        public decimal Price { get; set; }          //Сумма заказа

        public List<OrderlineVM> sostav { get; set; }  //Состав заказа
    }

    public class OrderlineVM
    {
        public int pId { get; set; }        //Id пиццы
        public int sId { get; set; }        //Id размера
        public int k { get; set; }          //Кол-во
        public decimal price { get; set; }  //Цена
        public List<IngVM> ing { get; set; }  //Состав
    }

    public class IngVM
    {
        public string name { get; set; }

        public int icount { get; set; }
    }
}
