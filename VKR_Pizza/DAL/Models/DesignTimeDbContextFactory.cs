using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace VKR_Pizza.DAL.Models
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<PizzaContext>
    {
        public PizzaContext CreateDbContext(string[] args)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())   //Установка пути к текущему каталогу
                .AddJsonFile("appsettings.json")                //Получаем конфигурацию из файла appsettings.json
                .Build();                                       //Создаем конфигурацию

            var builder = new DbContextOptionsBuilder<PizzaContext>();
            var connectionString = configuration.GetConnectionString("DefaultConnection");  //Получаем строку подключения
            builder.UseSqlServer(connectionString);

            return new PizzaContext(builder.Options);
        }
    }
}
