using VKR_Pizza.DAL.Models;
using System.Linq;

namespace VKR_Pizza.Data
{
    public class DbInitializer
    {
        public static void Initialize(PizzaContext db)
        {
            db.Database.EnsureCreated();
            if (db.Ingredient.Any())   //Проверка, есть ли в таблице записи
            {
                return;
            }

            var payment = new Payment[]
            {
                new Payment { Name = "Наличными" },
                new Payment { Name = "Сбербанк" },
                new Payment { Name = "Картой" },
            };
            foreach (Payment p in payment)
            {
                db.Payment.Add(p);
            }
            db.SaveChanges();

            var sizepizza = new SizePizza[]
            {
                new SizePizza { Name = "Стандартная", Size = 26, K=1.0 },
                new SizePizza { Name = "Средняя", Size = 30, K=1.1 },
                new SizePizza { Name = "Большая", Size = 37, K=1.2 },
            };
            foreach (SizePizza s in sizepizza)
            {
                db.SizePizza.Add(s);
                db.SaveChanges();
            }
            
            var status = new Status[]
            {
                new Status { Name = "Заказ в обработке" },
                new Status { Name = "Заказ готовится" },
                new Status { Name = "Заказ в пути" },
                new Status { Name = "Заказ доставлен" },
            };
            foreach (Status s in status)
            {
                db.Status.Add(s);
                db.SaveChanges();
            }

            var kategoris = new Kategori[]
            {
                new Kategori { Name ="Основа"},
                new Kategori { Name ="Соус", Picture="Sous.png"},
                new Kategori { Name ="Сыр", Picture="Cheese.png"},
                new Kategori { Name ="Мясо", Picture="Meat.png"},
                new Kategori { Name ="Рыба", Picture="Fish.png"},
                new Kategori { Name ="Грибы", Picture="Grib.png"},
                new Kategori { Name ="Овощи", Picture="Ovochi.png"},
                new Kategori { Name ="Специи", Picture="Specii.png"},
            };
            foreach (Kategori k in kategoris)
            {
                db.Kategori.Add(k);
                db.SaveChanges();
            }
            
            var ingredients = new Ingredient[]
            {
                new Ingredient { Name = "Тесто", Price = 80, Massa = 310, Kategori_FK=1, Picture="testo.png", availability = true },

                new Ingredient { Name = "Соус томатный", Price = 100, Massa = 85, Kategori_FK=2, Picture="soust.png", availability = true },
                new Ingredient { Name = "Соус томатный острый", Price = 60, Massa = 85, Kategori_FK=2, Picture="sousto.png", availability = true },
                new Ingredient { Name = "Соус фирменный", Price = 50, Massa = 90, Kategori_FK=2, Picture="sousf.png", availability = true },
                new Ingredient { Name = "Соус фирменный острый", Price = 50, Massa = 95, Kategori_FK=2, Picture="sousfo.png", availability = true },
                new Ingredient { Name = "Соус Цезарь", Price = 40, Massa = 90, Kategori_FK=2, Picture="sousc.png", availability = true },
                new Ingredient { Name = "Соус Баварский", Price = 80, Massa = 90, Kategori_FK=2, Picture="sousb.png", availability = true },
                new Ingredient { Name = "Соус грибной", Price = 80, Massa = 90, Kategori_FK=2, Picture="sousg.png", availability = true },

                new Ingredient { Name = "Сыр Гауда", Price = 150, Massa = 160, Kategori_FK=3, Picture="cheeseg.png", availability = true },
                new Ingredient { Name = "Сыр Голландский", Price = 150, Massa = 160, Kategori_FK=3, Picture="cheesego.png", availability = true },
                new Ingredient { Name = "Сыр с голубой плесенью", Price = 60, Massa = 20, Kategori_FK=3, Picture="cheesegp.png", availability = true },
                new Ingredient { Name = "Сыр Моцерелла", Price = 150, Massa = 160, Kategori_FK=3, Picture="cheesem.png", availability = true },
                new Ingredient { Name = "Сыр Пармезан", Price = 190, Massa = 120, Kategori_FK=3, Picture="cheesep.png", availability = true },

                new Ingredient { Name = "Ветчина 16шт", Price = 65, Massa = 70, Kategori_FK=4, Picture="vetchina.png", availability = true },
                new Ingredient { Name = "Колбаса пк 8шт", Price = 70, Massa = 55, Kategori_FK=4, Picture="kolbaca.png", availability = true },
                new Ingredient { Name = "Салями 8шт", Price = 60, Massa = 30, Kategori_FK=4, Picture="salymi.png", availability = true },
                new Ingredient { Name = "Бекон 8шт", Price = 40, Massa = 25, Kategori_FK=4, Picture="bekon.png", availability = true },
                new Ingredient { Name = "Пепперони 16шт", Price = 50, Massa = 20, Kategori_FK=4, Picture="peperoni.png", availability = true },
                new Ingredient { Name = "Бастурма 16шт", Price = 120, Massa = 40, Kategori_FK=4, Picture="basturma.png", availability = true },
                new Ingredient { Name = "Ассорти из колбас", Price = 60, Massa = 70, Kategori_FK=4, Picture="kolbacaz.png", availability = true },
                new Ingredient { Name = "Курица", Price = 80, Massa = 70, Kategori_FK=4, Picture="kurisa.png", availability = true },

                new Ingredient { Name = "Креветки", Price = 120, Massa = 35, Kategori_FK=5, Picture="krevetki.png", availability = true },
                new Ingredient { Name = "Семга", Price = 220, Massa = 70, Kategori_FK=5, Picture="semga.png", availability = true },

                new Ingredient { Name = "Опята", Price = 80, Massa = 50, Kategori_FK=6, Picture="opyta.png", availability = true },
                new Ingredient { Name = "Шампиньоны", Price = 60, Massa = 50, Kategori_FK=6, Picture="shampineon.png", availability = true },

                new Ingredient { Name = "Броколли 8шт", Price = 20, Massa = 25, Kategori_FK=7, Picture="brokoli.png", availability = true },
                new Ingredient { Name = "Свежий огурец 16шт", Price = 25, Massa = 25, Kategori_FK=7, Picture="ogures.png", availability = true },
                new Ingredient { Name = "Ананасы", Price = 80, Massa = 45, Kategori_FK=7, Picture="ananas.png", availability = true },
                new Ingredient { Name = "Морковь по-корейски", Price = 50, Massa = 60, Kategori_FK=7, Picture="morkovi.png", availability = true },
                new Ingredient { Name = "Перец халапаньо", Price = 30, Massa = 10, Kategori_FK=7, Picture="peresx.png", availability = true },
                new Ingredient { Name = "Кукуруза", Price = 30, Massa = 30, Kategori_FK=7, Picture="kukuruza.png", availability = true },
                new Ingredient { Name = "Маслины", Price = 40, Massa = 40, Kategori_FK=7, Picture="maslini.png", availability = true },
                new Ingredient { Name = "Помидоры", Price = 40, Massa = 35, Kategori_FK=7, Picture="pomidori.png", availability = true },
                new Ingredient { Name = "Маринованные огурчики", Price = 30, Massa = 40, Kategori_FK=7, Picture="oguresz.png", availability = true },
                new Ingredient { Name = "Лук красный", Price = 20, Massa = 15, Kategori_FK=7, Picture="lyk.png", availability = true },
                new Ingredient { Name = "Перец болгарский", Price = 30, Massa = 30, Kategori_FK=7, Picture="peresb.png", availability = true },
                new Ingredient { Name = "Помидоры черри 8шт", Price = 70, Massa = 50, Kategori_FK=7, Picture="pomidoriz.png", availability = true },

                new Ingredient { Name = "Салат Айсберг", Price = 35, Massa = 30, Kategori_FK=8, Picture="salata.png", availability = true },
                new Ingredient { Name = "Базилик", Price = 10, Massa = 1, Kategori_FK=8, Picture="bazilik.png", availability = true },
                new Ingredient { Name = "Зелень", Price = 10, Massa = 5, Kategori_FK=8, Picture="zelen.png", availability = true },
                new Ingredient { Name = "Микс салат", Price = 30, Massa = 14, Kategori_FK=8, Picture="salatz.png", availability = true },
                new Ingredient { Name = "Черный перец", Price = 5, Massa = 1, Kategori_FK=8, Picture="cherniyperes.png", availability = true },
                new Ingredient { Name = "Майонез", Price = 20, Massa = 50, Kategori_FK=8, Picture="maonez.png", availability = true },
                new Ingredient { Name = "Соус Барбекю", Price = 30, Massa = 30, Kategori_FK=8, Picture="barbeku.png", availability = true },
            };
            foreach (Ingredient ing in ingredients)
            {
                db.Ingredient.Add(ing);
                db.SaveChanges();
            }
            
            var product = new Product[]
            {
                new Product { Name ="Конструктор", Price = 1, Picture = "konst.png"},
            };
            foreach (Product p in product)
            {
                db.Product.Add(p);
            }
            db.SaveChanges();
        }
    }
}
