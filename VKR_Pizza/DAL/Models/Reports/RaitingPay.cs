using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VKR_Pizza.DAL.Models.Reports
{
    public class RaitingPay
    {
        public int Pay_Id { get; set; }     //Id способа оплаты
        public string Name { get; set; }    //Наименование метода оплаты
        public int count { get; set; }      //Количество оплаты данным методом
    }
}
