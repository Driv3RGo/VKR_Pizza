using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VKR_Pizza.DAL.Models
{
    public class ProductViewModel
    {
        public string name { get; set; }        //Наименование пиццы

        public decimal price { get; set; }      //Цена пиццы

        public string picture { get; set; }     //Картинка пиццы

        public List<CompositionVM> sostav { get; set; }  //Состав пиццы
    }

    public class CompositionVM
    {
        public int id { get; set; }         //Id ингредиента
        public int icount { get; set; }     //Количество
    }
}
