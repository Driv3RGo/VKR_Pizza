using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VKR_Pizza.DAL.Models.Reports
{
    public class OrderforDate
    {
        public int Order_Id { get; set; }   //Id заказа
        public string Date { get; set; }    //Дата заказа
        public decimal Price { get; set; }  //Стоимость
        public string pay { get; set; }     //Способ оплаты
    }
}
