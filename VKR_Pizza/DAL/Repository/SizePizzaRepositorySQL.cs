using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VKR_Pizza.DAL.Models;
using VKR_Pizza.DAL.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace VKR_Pizza.DAL.Repository
{
    public class SizePizzaRepositorySQL : IRepository<SizePizza>
    {
        private PizzaContext db;
        public SizePizzaRepositorySQL(PizzaContext dbcontext)
        {
            db = dbcontext;
        }

        public List<SizePizza> GetList()  //Получение всех элементов
        {
            return db.SizePizza.ToList();
        }

        public SizePizza GetItem(int id)  //Получение элемента по id
        {
            return db.SizePizza.Find(id);
        }

        public void Create(SizePizza item)    //Создание нового элемента
        {
            db.SizePizza.Add(item);
        }

        public void Update(SizePizza item)      //Обновление элемента
        {
            db.Entry(item).State = EntityState.Modified;
        }

        public void Delete(int id)      //Удаление элемента по id
        {
            SizePizza item = db.SizePizza.Find(id);
            if (item != null)
                db.SizePizza.Remove(item);
        }

        public bool Save()      //Сохраняем изменения
        {
            return db.SaveChanges() > 0;
        }
    }
}
