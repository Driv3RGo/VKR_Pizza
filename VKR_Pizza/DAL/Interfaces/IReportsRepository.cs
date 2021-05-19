using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VKR_Pizza.DAL.Models;
using VKR_Pizza.DAL.Models.Reports;

namespace VKR_Pizza.DAL.Interfaces
{
    public interface IReportsRepository
    {
        List<RaitingPizza> GetRatingPizza(DateTime date1, DateTime date2);      //Вывод рейтинга пицц
        List<RaitingModer> GetRatingModer(DateTime date1, DateTime date2);      //Вывод рейтинга модераторов
        List<OrderforDate> GetOrders(DateTime date1, DateTime date2);           //Вывод заказов
        List<RaitingPay> GetRaitingPay(DateTime date1, DateTime date2);         //Вывод рейтинга способов оплаты
        List<RaitingSize> GetRaitingSize(DateTime date1, DateTime date2);       //Вывод рейтинга размеров пицц
        List<OrderModer> GetOrderNewDate();                                     //Вывод заказов на сегодняшний день
        List<OrderUser> GetOrderUser(string user);                              //Вывод заказов пользователя
        List<string> GetImagePizza();                                           //Вывод существующих картинок пицц
        string GetRoles();   //Вывод списка ролей пользователя
    }
}
