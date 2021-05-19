using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VKR_Pizza.DAL.Models;
using VKR_Pizza.DAL.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace VKR_Pizza.DAL.Repository
{
    public class KategoriRepositorySQL : IRepository<Kategori>
    {
        private PizzaContext db;
        public KategoriRepositorySQL(PizzaContext dbcontext)
        {
            db = dbcontext;
        }

        public List<Kategori> GetList()  //Получение всех элементов
        {
            return db.Kategori.Where(i => i.KategoriId != 1).ToList();
        }

        public Kategori GetItem(int id)  //Получение элемента по id
        {
            return db.Kategori.Find(id);
        }

        public void Create(Kategori item)    //Создание нового элемента
        {
            db.Kategori.Add(item);
        }

        public void Update(Kategori item)      //Обновление элемента
        {
            db.Entry(item).State = EntityState.Modified;
        }

        public void Delete(int id)      //Удаление элемента по id
        {
            Kategori item = db.Kategori.Find(id);
            if (item != null)
                db.Kategori.Remove(item);
        }

        public bool Save()      //Сохраняем изменения
        {
            return db.SaveChanges() > 0;
        }
    }
}
