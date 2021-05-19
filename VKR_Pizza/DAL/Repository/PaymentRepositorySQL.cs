using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VKR_Pizza.DAL.Models;
using VKR_Pizza.DAL.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace VKR_Pizza.DAL.Repository
{
    public class PaymentRepositorySQL : IRepository<Payment>
    {
        private PizzaContext db;
        public PaymentRepositorySQL(PizzaContext dbcontext)
        {
            db = dbcontext;
        }

        public List<Payment> GetList()  //Получение всех элементов
        {
            return db.Payment.ToList();
        }

        public Payment GetItem(int id)  //Получение элемента по id
        {
            return db.Payment.Find(id);
        }

        public void Create(Payment item)    //Создание нового элемента
        {
            db.Payment.Add(item);
        }

        public void Update(Payment item)      //Обновление элемента
        {
            db.Entry(item).State = EntityState.Modified;
        }

        public void Delete(int id)      //Удаление элемента по id
        {
            Payment item = db.Payment.Find(id);
            if (item != null)
                db.Payment.Remove(item);
        }

        public bool Save()      //Сохраняем изменения
        {
            return db.SaveChanges() > 0;
        }
    }
}
