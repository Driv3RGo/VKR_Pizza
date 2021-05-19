using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VKR_Pizza.DAL.Models.Reports
{
    public class RaitingSize
    {
        public int Size_Id { get; set; }    //Id размера
        public string Name { get; set; }    //Наименование размера
        public int Size { get; set; }       //Размер
        public double K { get; set; }       //Коэффициент увеличения цены
        public int count { get; set; }      //Количество заказов пицц с данным размером
    }
}
