using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VKR_Pizza.DAL.Models;
using VKR_Pizza.DAL.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace VKR_Pizza.DAL.Repository
{
    public class StatusRepositorySQL : IRepository<Status>
    {
        private PizzaContext db;
        public StatusRepositorySQL(PizzaContext dbcontext)
        {
            db = dbcontext;
        }

        public List<Status> GetList()  //Получение всех элементов
        {
            return db.Status.ToList();
        }

        public Status GetItem(int id)  //Получение элемента по id
        {
            return db.Status.Find(id);
        }

        public void Create(Status item)    //Создание нового элемента
        {
            db.Status.Add(item);
        }

        public void Update(Status item)      //Обновление элемента
        {
            db.Entry(item).State = EntityState.Modified;
        }

        public void Delete(int id)      //Удаление элемента по id
        {
            Status item = db.Status.Find(id);
            if (item != null)
                db.Status.Remove(item);
        }

        public bool Save()      //Сохраняем изменения
        {
            return db.SaveChanges() > 0;
        }
    }
}
