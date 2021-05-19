using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VKR_Pizza.DAL.Models;
using VKR_Pizza.DAL.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace VKR_Pizza.DAL.Repository
{
    public class IngredientRepositorySQL : IRepository<Ingredient>
    {
        private PizzaContext db;
        public IngredientRepositorySQL(PizzaContext dbcontext)
        {
            db = dbcontext;
        }

        public List<Ingredient> GetList()  //Получение всех элементов
        {
            return db.Ingredient.Include(i => i.Kategori).ToList();
        }

        public Ingredient GetItem(int id)  //Получение элемента по id
        {
            return db.Ingredient.Find(id);
        }

        public void Create(Ingredient item)    //Создание нового элемента
        {
            db.Ingredient.Add(item);
        }

        public void Update(Ingredient item)      //Обновление элемента
        {
            db.Entry(item).State = EntityState.Modified;
        }

        public void Delete(int id)      //Удаление элемента по id
        {
            Ingredient item = db.Ingredient.Find(id);
            if (item != null)
                db.Ingredient.Remove(item);
        }

        public bool Save()      //Сохраняем изменения
        {
            return db.SaveChanges() > 0;
        }
    }
}
