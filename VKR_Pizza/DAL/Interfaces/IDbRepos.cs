using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using VKR_Pizza.DAL.Models;

namespace VKR_Pizza.DAL.Interfaces
{
    public interface IDbRepos
    {
        IRepository<Composition> Compositions { get; }  //Состав пиццы
        IRepository<Ingredient> Ingredients { get; }    //Ингредиенты
        IRepository<Kategori> Kategoris { get; }        //Категории ингредиентов
        IRepository<Order> Orders { get; }              //Заказ
        IRepository<Order_line> Order_lines { get; }    //Строка заказа
        IRepository<Product> Products { get; }          //Каталог продуктов
        IRepository<Status> Statuses { get; }           //Статус заказа  
        IRepository<Payment> Payments { get; }          //Способ олпаты
        IRepository<SizePizza> SizePizzas { get; }      //Размер пиццы
        IReportsRepository Reports { get; }             //Запросы и отчёт

        int Save();
    }
}
