using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace VKR_Pizza.DAL.Models
{
    public class PizzaContext : IdentityDbContext<User>
    {
        public PizzaContext(DbContextOptions<PizzaContext> options) : base(options) { }

        public virtual DbSet<Composition> Composition { get; set; }
        public virtual DbSet<Ingredient> Ingredient { get; set; }
        public virtual DbSet<Kategori> Kategori { get; set; }
        public virtual DbSet<Order> Order { get; set; }
        public virtual DbSet<Order_line> Order_line { get; set; }
        public virtual DbSet<SizePizza> SizePizza { get; set; }
        public virtual DbSet<Product> Product { get; set; }
        public virtual DbSet<Status> Status { get; set; }
        public virtual DbSet<Payment> Payment { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);     //Задействуем функционал Fluent API(изменение правил в Entity Framework)

            modelBuilder.Entity<Product>().Property(p =>
            p.Price).HasColumnType("decimal(18, 2)");
            modelBuilder.Entity<Ingredient>().Property(p =>
            p.Price).HasColumnType("decimal(18, 2)");
            modelBuilder.Entity<Order_line>().Property(p =>
            p.Price).HasColumnType("decimal(18, 2)");
            modelBuilder.Entity<Order>().Property(p =>
            p.Price).HasColumnType("decimal(18, 2)");

            modelBuilder.Entity<Order>(entity =>    //Связь 1 к многим (1 клиент = много заказов, соединение по ключу User_FK)
            {
                entity.HasOne(p => p.User)
                .WithMany(p => p.Orders)
                .HasForeignKey(p => p.User_FK);
            });

            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasOne(p => p.Status)
                .WithMany(p => p.Orders)
                .HasForeignKey(p => p.Status_FK);
            });

            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasOne(p => p.Payment)
                .WithMany(p => p.Orders)
                .HasForeignKey(p => p.Payment_FK);
            });

            modelBuilder.Entity<Order_line>(entity =>
            {
                entity.HasOne(p => p.SizePizza)
                .WithMany(p => p.Order_lines)
                .HasForeignKey(p => p.Size_FK);
            });

            modelBuilder.Entity<Order_line>(entity =>
            {
                entity.HasOne(p => p.Order)
                .WithMany(p => p.Order_lines)
                .HasForeignKey(p => p.Order_FK);
            });

            modelBuilder.Entity<Order_line>(entity =>
            {
                entity.HasOne(p => p.Product)
                .WithMany(p => p.Order_lines)
                .HasForeignKey(p => p.Product_FK);
            });

            modelBuilder.Entity<Composition>(entity =>
            {
                entity.HasOne(p => p.Product)
                .WithMany(p => p.Compositions)
                .HasForeignKey(p => p.Product_FK);
            });

            modelBuilder.Entity<Composition>(entity =>
            {
                entity.HasOne(p => p.Ingredient)
                .WithMany(p => p.Compositions)
                .HasForeignKey(p => p.Ingredient_FK);
            });

            modelBuilder.Entity<Ingredient>(entity =>
            {
                entity.HasOne(p => p.Kategori)
                .WithMany(p => p.Ingredients)
                .HasForeignKey(p => p.Kategori_FK);
            });
        }
    }
}
