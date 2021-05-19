using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VKR_Pizza.DAL.Models;
using VKR_Pizza.DAL.Models.Reports;
using VKR_Pizza.DAL.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace VKR_Pizza.DAL.Repository
{
    public class ReportRepositorySQL : IReportsRepository
    {
        private PizzaContext db;
        public ReportRepositorySQL(PizzaContext dbcontext)
        {
            db = dbcontext;
        }

        //Вывод рейтинга пицц по дате
        public List<RaitingPizza> GetRatingPizza(DateTime date1, DateTime date2)
        {
            if(DateTime.Compare(date2, date1) < 0)
            {
                DateTime buf = date2;
                date2 = date1;
                date1 = buf;
            }
            List<RaitingPizza> raitings = new List<RaitingPizza>();
            List<Order_line> order_l = db.Order_line.Include(i => i.Order).Include(i => i.Product).Where(i => DateTime.Compare(i.Order.DataBegin,date1) >= 0 && DateTime.Compare(i.Order.DataBegin, date2) <= 0).ToList();
            foreach(Order_line ol in order_l)
            {
                int index = raitings.FindIndex(i => i.Pizza_Id == ol.Product_FK);
                if(index == -1)
                {
                    RaitingPizza rp = new RaitingPizza();
                    rp.Pizza_Id = ol.Product_FK;
                    rp.Name = ol.Product.Name;
                    rp.Price = ol.Product.Price;
                    rp.count = ol.Count;
                    raitings.Add(rp);
                }
                else
                {
                    raitings[index].count+= ol.Count;
                }
            }
            return raitings.OrderByDescending(i => i.count).ToList();
        }

        //Вывод рейтинга операторов по дате
        public List<RaitingModer> GetRatingModer(DateTime date1, DateTime date2)
        {
            int percent = 20;
            if (DateTime.Compare(date2, date1) < 0)
            {
                DateTime buf = date2;
                date2 = date1;
                date1 = buf;
            }
            List<RaitingModer> raitings = new List<RaitingModer>();
            List<Order> orders = db.Order
                .Where(i => DateTime.Compare(i.DataBegin, date1) >= 0 && DateTime.Compare(i.DataBegin, date2) <= 0 && i.DataEnd != null)
                .ToList();
            List<User> user = db.Users.ToList();
            foreach (Order o in orders)
            {
                int index = raitings.FindIndex(i => i.user_Id == o.Moder_FK);
                if (index == -1)
                {
                    RaitingModer rm = new RaitingModer();
                    rm.user_Id = o.Moder_FK;
                    rm.FIO = user.Find(i => i.Id == o.Moder_FK).FIO;
                    rm.count = 1;
                    rm.payday = (o.Price / 100) * percent;
                    raitings.Add(rm);
                }
                else
                {
                    raitings[index].count++;
                    raitings[index].payday += (o.Price / 100) * percent;
                }
            }
            return raitings.OrderByDescending(i => i.count).ToList();
        }

        //Вывод заказов по дате с доходом
        public List<OrderforDate> GetOrders(DateTime date1, DateTime date2)
        {
            if (DateTime.Compare(date2, date1) < 0)
            {
                DateTime buf = date2;
                date2 = date1;
                date1 = buf;
            }
            List<OrderforDate> orders = new List<OrderforDate>();
            List<Order> or = db.Order.Include(i => i.Payment).Where(i => DateTime.Compare(i.DataBegin, date1) >= 0 && DateTime.Compare(i.DataBegin, date2) <= 0).ToList();
            foreach (Order o in or)
            {
                OrderforDate ofd = new OrderforDate { Order_Id = o.OrderID, Date = o.DataBegin.ToString("dd.MM.yyyy"), pay = o.Payment.Name, Price = o.Price };
                orders.Add(ofd);
            }
            return orders;
        }

        //Вывод рейтинга способов оплаты
        public List<RaitingPay> GetRaitingPay(DateTime date1, DateTime date2)
        {
            if (DateTime.Compare(date2, date1) < 0)
            {
                DateTime buf = date2;
                date2 = date1;
                date1 = buf;
            }
            List<RaitingPay> raitings = new List<RaitingPay>();
            List<Payment> payment = db.Payment.ToList();
            List<Order> order = db.Order.Include(i => i.Payment).Where(i => DateTime.Compare(i.DataBegin, date1) >= 0 && DateTime.Compare(i.DataBegin, date2) <= 0).ToList();
            foreach (Payment p in payment)
            {
                raitings.Add(new RaitingPay { Pay_Id = p.PaymentId, Name = p.Name, count = 0 });
            }
            foreach (Order o in order)
            {
                int index = raitings.FindIndex(i => i.Pay_Id == o.Payment_FK);
                if (index != -1)
                    raitings[index].count++;

            }
            return raitings.OrderByDescending(i => i.count).ToList();
        }

        //Вывод рейтинга размеров пицц
        public List<RaitingSize> GetRaitingSize(DateTime date1, DateTime date2)
        {
            if (DateTime.Compare(date2, date1) < 0)
            {
                DateTime buf = date2;
                date2 = date1;
                date1 = buf;
            }
            List<RaitingSize> raitings = new List<RaitingSize>();
            List<SizePizza> sizePizzas = db.SizePizza.ToList();
            List<Order_line> order_l = db.Order_line.Include(i => i.Order).Where(i => DateTime.Compare(i.Order.DataBegin, date1) >= 0 && DateTime.Compare(i.Order.DataBegin, date2) <= 0).ToList();
            foreach (SizePizza sp in sizePizzas)
            {
                raitings.Add(new RaitingSize { Size_Id = sp.SizeId, Name = sp.Name, Size = sp.Size, K = sp.K, count = 0 });
            }
            foreach (Order_line ol in order_l)
            {
                int index = raitings.FindIndex(i => i.Size_Id == ol.Size_FK);
                if (index != -1)
                    raitings[index].count += ol.Count;
            }
            return raitings.OrderByDescending(i => i.count).ToList();
        }

        //Вывод заказов за сегодняшний день
        public List<OrderModer> GetOrderNewDate()
        {
            var dateStart = DateTime.Now.Date;
            var dateEnd = DateTime.Now.AddDays(1).Date;
            List<Order> order = db.Order
                .Include(i => i.Order_lines)
                    .ThenInclude(i => i.Product)
                .Include(i => i.Order_lines)
                    .ThenInclude(i => i.SizePizza)
                .Include(i => i.Payment)
                .Include(i => i.Status)
                .Where(i => DateTime.Compare(i.DataBegin, dateStart) >= 0 && DateTime.Compare(i.DataBegin, dateEnd) <= 0)
                .ToList();
            List<OrderModer> orderModer = new List<OrderModer>();
            foreach (Order ord in order)
            {
                List<ProductModer> pm = new List<ProductModer>();
                foreach (Order_line ol in ord.Order_lines)
                {
                    ProductModer p = new ProductModer { Name = ol.Product.Name, Count = ol.Count, Price = ol.Price, Size = ol.SizePizza.Size, Message = ol.Message };
                    pm.Add(p);
                }
                OrderModer om = new OrderModer { Order_Id = ord.OrderID, Date = ord.DataBegin.ToString("dd.MM.yyyy, HH:mm"), Price = ord.Price, Pay = ord.Payment.Name, Address = ord.Address, Message = ord.Message, Status = ord.Status.Name, Status_FK = ord.Status_FK, Moder_FK = ord.Moder_FK, Sostav = pm };
                orderModer.Add(om);
            }
            return orderModer;
        }

        //Вывод заказов пользователя
        public List<OrderUser> GetOrderUser(string user)
        {
            List<Order> order = db.Order
                .Include(i => i.Order_lines)
                    .ThenInclude(i => i.Product)
                .Include(i => i.Order_lines)
                    .ThenInclude(i => i.SizePizza)
                .Include(i => i.Payment)
                .Include(i => i.Status)
                .Where(i => i.User_FK == user)
                .OrderByDescending(i => i.DataBegin)
                .ToList();
            List<OrderUser> orderUser = new List<OrderUser>();
            foreach(Order ord in order)
            {
                List<ProductUser> pu = new List<ProductUser>();
                foreach(Order_line ol in ord.Order_lines)
                {
                    ProductUser p = new ProductUser { Name = ol.Product.Name, Count = ol.Count, Price = ol.Price, Size = ol.SizePizza.Size };
                    pu.Add(p);
                }
                bool flag = false;
                if (ord.DataEnd != null)
                    flag = true;
                OrderUser ou = new OrderUser { Order_Id = ord.OrderID, Date = ord.DataBegin.ToString("dd.MM.yyyy"), Price = ord.Price, Status = ord.Status.Name, Count = ord.Order_lines.Sum(i => i.Count), dateEnd = flag, Sostav = pu };
                orderUser.Add(ou);
            }
            return orderUser;
        }

        //Вывод существующих картинок пицц
        public List<string> GetImagePizza()
        {
            List<string> listImage = new List<string>();
            var product = db.Product.ToList();
            foreach(var pr in product)
            {
                listImage.Add(pr.Picture);
            }
            return listImage;
        }

        //Вывод доступных ролей
        public string GetRoles()
        {
            var role = db.Roles.ToList();   //Получаем список ролей
            string roles = "";
            foreach(var r in role)
            {
                roles += r.Name + ",";
            }
            return roles.Remove(roles.Length-1);
        }
    }
}
