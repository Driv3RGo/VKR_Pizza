using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VKR_Pizza.DAL.Models.Reports
{
    public class RaitingModer
    {
        public string user_Id { get; set; } //Id модера
        public string FIO { get; set; }     //ФИО модера
        public int count { get; set; }      //Количество отработанных заказов
        public decimal payday { get; set; } //Грязная зарплата
    }
}
