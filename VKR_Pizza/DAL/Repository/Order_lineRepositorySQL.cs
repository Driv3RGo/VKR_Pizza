using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VKR_Pizza.DAL.Models;
using VKR_Pizza.DAL.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace VKR_Pizza.DAL.Repository
{
    public class Order_lineRepositorySQL : IRepository<Order_line>
    {
        private PizzaContext db;
        public Order_lineRepositorySQL(PizzaContext dbcontext)
        {
            db = dbcontext;
        }

        public List<Order_line> GetList()  //Получение всех элементов
        {
            return db.Order_line.ToList();
        }

        public Order_line GetItem(int id)  //Получение элемента по id
        {
            return db.Order_line.Find(id);
        }

        public void Create(Order_line item)    //Создание нового элемента
        {
            db.Order_line.Add(item);
        }

        public void Update(Order_line item)      //Обновление элемента
        {
            db.Entry(item).State = EntityState.Modified;
        }

        public void Delete(int id)      //Удаление элемента по id
        {
            Order_line item = db.Order_line.Find(id);
            if (item != null)
                db.Order_line.Remove(item);
        }

        public bool Save()      //Сохраняем изменения
        {
            return db.SaveChanges() > 0;
        }
    }
}
