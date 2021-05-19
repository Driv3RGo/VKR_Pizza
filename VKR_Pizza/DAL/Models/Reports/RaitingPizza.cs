using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VKR_Pizza.DAL.Models.Reports
{
    public class RaitingPizza
    {
        public int Pizza_Id { get; set; }   //Id пиццы
        public string Name { get; set; }    //Название пиццы
        public decimal Price { get; set; }  //Цена пиццы
        public int count { get; set; }      //Количество заказов данной пиццы
    }
}
