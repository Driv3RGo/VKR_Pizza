using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VKR_Pizza.DAL.Models;
using VKR_Pizza.DAL.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace VKR_Pizza.DAL.Repository
{
    public class ProductRepositorySQL : IRepository<Product>
    {
        private PizzaContext db;
        public ProductRepositorySQL(PizzaContext dbcontext)
        {
            db = dbcontext;
        }

        public List<Product> GetList()  //Получение всех элементов
        {
            return db.Product.Where(p => p.ProductID != 1).Include(p => p.Compositions).ThenInclude(p => p.Ingredient).ToList();     //Вывод всех продуктов из БД
        }

        public Product GetItem(int id)      //Получение элемента по id
        {
            var product = db.Product.Include(p => p.Compositions).ThenInclude(p => p.Ingredient).ToList();
            return product.Find(i => i.ProductID == id);
        }

        public void Create(Product item)    //Создание нового элемента
        {
            db.Product.Add(item);
        }

        public void Update(Product item)    //Обновление элемента
        {
            db.Entry(item).State = EntityState.Modified;
        }

        public void Delete(int id)      //Удаление элемента по id
        {
            Product item = db.Product.Find(id);
            if (item != null)
                db.Product.Remove(item);
        }

        public bool Save()      //Сохраняем изменения
        {
            return db.SaveChanges() > 0;
        }
    }
}
