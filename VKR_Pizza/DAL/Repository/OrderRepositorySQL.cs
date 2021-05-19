using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VKR_Pizza.DAL.Models;
using VKR_Pizza.DAL.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace VKR_Pizza.DAL.Repository
{
    public class OrderRepositorySQL : IRepository<Order>
    {
        private PizzaContext db;
        public OrderRepositorySQL(PizzaContext dbcontext)
        {
            db = dbcontext;
        }

        public List<Order> GetList()  //Получение всех элементов
        {
            return db.Order.Include(p => p.Status).Include(p => p.Payment).Include(p => p.Order_lines).ThenInclude(p => p.Product).ToList();
        }

        public Order GetItem(int id)  //Получение элемента по id
        {
            var order = db.Order.Include(p => p.Status).Include(p => p.Payment).Include(p => p.Order_lines).ThenInclude(p => p.Product).ToList();
            return order.Find(i => i.OrderID == id);
        }

        public void Create(Order item)    //Создание нового элемента
        {
            db.Order.Add(item);
        }

        public void Update(Order item)      //Обновление элемента
        {
            db.Entry(item).State = EntityState.Modified;
        }

        public void Delete(int id)      //Удаление элемента по id
        {
            Order item = db.Order.Find(id);
            if (item != null)
                db.Order.Remove(item);
        }

        public bool Save()      //Сохраняем изменения
        {
            return db.SaveChanges() > 0;
        }
    }
}
