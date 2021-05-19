using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VKR_Pizza.DAL.Interfaces
{
    public interface IRepository<T> where T : class
    {
        List<T> GetList();      //Получение всех объектов
        T GetItem(int id);      //Получение одного объекта по id
        void Create(T item);    //Создание объекта
        void Update(T item);    //Обновление объекта
        void Delete(int id);    //Удаление объекта по id
    }
}
