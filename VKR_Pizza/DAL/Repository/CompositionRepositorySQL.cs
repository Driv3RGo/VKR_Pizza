using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VKR_Pizza.DAL.Models;
using VKR_Pizza.DAL.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace VKR_Pizza.DAL.Repository
{
    public class CompositionRepositorySQL : IRepository<Composition>
    {
        private PizzaContext db;
        public CompositionRepositorySQL(PizzaContext dbcontext)
        {
            db = dbcontext;
        }

        public List<Composition> GetList()  //Получение всех элементов
        {
            return db.Composition.ToList();
        }

        public Composition GetItem(int id)  //Получение элемента по id
        {
            return db.Composition.Find(id);
        }

        public void Create(Composition item)    //Создание нового элемента
        {
            db.Composition.Add(item);
        }

        public void Update(Composition item)      //Обновление элемента
        {
            db.Entry(item).State = EntityState.Modified;
        }

        public void Delete(int id)      //Удаление элемента по id
        {
            Composition item = db.Composition.Find(id);
            if (item != null)
                db.Composition.Remove(item);
        }

        public bool Save()      //Сохраняем изменения
        {
            return db.SaveChanges() > 0;
        }
    }
}
