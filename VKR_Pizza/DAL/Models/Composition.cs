using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VKR_Pizza.DAL.Models
{
    public class Composition
    {
        [Key]                                   //Первичный ключ
        public int ID { get; set; }             //Id записи

        public int Product_FK { get; set; }     //Id пиццы

        public int Ingredient_FK { get; set; }  //Id ингредиента

        public int Count { get; set; }          //Количества ингредиентов данного вида

        public virtual Ingredient Ingredient { get; set; }

        public virtual Product Product { get; set; }
    }
}
