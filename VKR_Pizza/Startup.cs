using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

using Microsoft.EntityFrameworkCore;
using VKR_Pizza.DAL.Models;
using VKR_Pizza.DAL.Interfaces;
using VKR_Pizza.DAL.Repository;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Identity;

namespace VKR_Pizza
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        //Этот метод вызывается средой выполнения. Используйте этот метод для добавления служб в контейнер.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddIdentity<User, IdentityRole>(opts => {  //Правило для пароля
                opts.Password.RequiredLength = 6;               //Минимальная длина
                opts.Password.RequireNonAlphanumeric = false;   //Требуются ли не алфавитно-цифровые символы
                opts.Password.RequireLowercase = true;          //Требуются ли символы в нижнем регистре
                opts.Password.RequireUppercase = false;         //Требуются ли символы в верхнем регистре
                opts.Password.RequireDigit = true;              //Требуются ли цифры
            }).AddEntityFrameworkStores<PizzaContext>()
            .AddDefaultTokenProviders();

            var connection = Configuration.GetConnectionString("DefaultConnection");
            services.AddDbContext<PizzaContext>(options => options.UseSqlServer(connection));

            services.AddScoped<IDbRepos, DbReposSQL>();     //Создает один экземпляр объекта для всего запроса
            services.AddMvc().AddNewtonsoftJson(o =>
            {
                o.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            });
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_3_0);
        }

        //Этот метод вызывается средой выполнения. Используйте этот метод для настройки конвейера HTTP-запросов.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IServiceProvider services)
        {
            CreateUserRoles(services).Wait();
            // Если приложение в процессе разработки
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();    //то выводим информацию об ошибке, при наличии ошибки
            }
            else
            {
                app.UseHsts();
            }

            app.UseAuthentication();    //Аутентификация
            app.UseDefaultFiles();
            app.UseStaticFiles();       //Использование статических файлов
            app.UseHttpsRedirection();
            app.UseRouting();           //Добавляем возможности маршрутизации
            //Устанавливаем адреса, которые будут обрабатываться
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }

        //Метод создающий роли
        private async Task CreateUserRoles(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<User>>();

            // Создание ролей администратора, оператора и пользователя
            if (await roleManager.FindByNameAsync("admin") == null)
            {
                await roleManager.CreateAsync(new IdentityRole("admin"));
            }
            if (await roleManager.FindByNameAsync("moder") == null)
            {
                await roleManager.CreateAsync(new IdentityRole("moder"));
            }
            if (await roleManager.FindByNameAsync("user") == null)
            {
                await roleManager.CreateAsync(new IdentityRole("user"));
            }

            // Создание Администратора
            string adminFIO = "Ткачёв Никита Витальевич";
            string adminEmail = "driv3rgo@yandex.ru";
            string adminPhone = "9038271093";
            string adminPassword = "123qwe";
            if (await userManager.FindByNameAsync(adminEmail) == null)
            {
                User admin = new User { PhoneNumber = adminPhone, Email = adminEmail, FIO = adminFIO, UserName = adminEmail };
                admin.EmailConfirmed = true;
                IdentityResult result = await userManager.CreateAsync(admin, adminPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(admin, "admin");
                }
            }

            // Создание Оператора
            string moderFIO = "Ткачёв Никита Витальевич";
            string moderEmail = "driv3rgo@mail.ru";
            string moderPhone = "9999999999";
            string moderPassword = "123qwe";
            if (await userManager.FindByNameAsync(moderEmail) == null)
            {
                User moder = new User { PhoneNumber = moderPhone, Email = moderEmail, FIO = moderFIO, UserName = moderEmail };
                moder.EmailConfirmed = true;
                IdentityResult result = await userManager.CreateAsync(moder, moderPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(moder, "moder");
                }
            }

            // Создание Пользователя
            string userFIO = "Просто пользователь";
            string userEmail = "user@mail.com";
            string userPhone = "8888888888";
            string userPassword = "123qwe";
            if (await userManager.FindByNameAsync(userEmail) == null)
            {
                User user = new User { PhoneNumber = userPhone, Email = userEmail, FIO = userFIO, UserName = userEmail };
                user.EmailConfirmed = true;
                IdentityResult result = await userManager.CreateAsync(user, userPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, "user");
                }
            }
        }
    }
}
