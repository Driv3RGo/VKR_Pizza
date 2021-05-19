using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VKR_Pizza.DAL.Models;
using VKR_Pizza.DAL.Interfaces;

namespace VKR_Pizza.DAL.Repository
{
    public class DbReposSQL : IDbRepos
    {
        private PizzaContext db;

        private CompositionRepositorySQL compositionRepository;
        private IngredientRepositorySQL ingredientRepository;
        private KategoriRepositorySQL kategoriRepository;
        private Order_lineRepositorySQL order_lineRepository;
        private OrderRepositorySQL orderRepository;
        private ProductRepositorySQL productRepository;
        private StatusRepositorySQL statusRepository;
        private PaymentRepositorySQL paymentRepository;
        private SizePizzaRepositorySQL sizepizzaRepository;
        private ReportRepositorySQL reportRepository;

        public DbReposSQL(PizzaContext dbcontext)
        {
            db = dbcontext;
        }

        public IRepository<Composition> Compositions
        {
            get
            {
                if (compositionRepository == null)
                    compositionRepository = new CompositionRepositorySQL(db);
                return compositionRepository;
            }
        }

        public IRepository<Ingredient> Ingredients
        {
            get
            {
                if (ingredientRepository == null)
                    ingredientRepository = new IngredientRepositorySQL(db);
                return ingredientRepository;
            }
        }

        public IRepository<Kategori> Kategoris
        {
            get
            {
                if (kategoriRepository == null)
                    kategoriRepository = new KategoriRepositorySQL(db);
                return kategoriRepository;
            }
        }

        public IRepository<Order_line> Order_lines
        {
            get
            {
                if (order_lineRepository == null)
                    order_lineRepository = new Order_lineRepositorySQL(db);
                return order_lineRepository;
            }
        }

        public IRepository<Order> Orders
        {
            get
            {
                if (orderRepository == null)
                    orderRepository = new OrderRepositorySQL(db);
                return orderRepository;
            }
        }

        public IRepository<Product> Products
        {
            get
            {
                if (productRepository == null)
                    productRepository = new ProductRepositorySQL(db);
                return productRepository;
            }
        }

        public IRepository<Status> Statuses
        {
            get
            {
                if (statusRepository == null)
                    statusRepository = new StatusRepositorySQL(db);
                return statusRepository;
            }
        }

        public IRepository<Payment> Payments
        {
            get
            {
                if (paymentRepository == null)
                    paymentRepository = new PaymentRepositorySQL(db);
                return paymentRepository;
            }
        }

        public IRepository<SizePizza> SizePizzas
        {
            get
            {
                if (sizepizzaRepository == null)
                    sizepizzaRepository = new SizePizzaRepositorySQL(db);
                return sizepizzaRepository;
            }
        }

        public IReportsRepository Reports
        {
            get
            {
                if (reportRepository == null)
                    reportRepository = new ReportRepositorySQL(db);
                return reportRepository;
            }
        }

        public int Save()
        {
            return db.SaveChanges();
        }
    }
}
