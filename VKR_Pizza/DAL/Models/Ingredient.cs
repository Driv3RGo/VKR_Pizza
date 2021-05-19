using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VKR_Pizza.DAL.Models
{
    public class Ingredient
    {
        public Ingredient()
        {
            Compositions = new HashSet<Composition>();
        }

        [Key]                                   //Первичный ключ
        public int IngredientID { get; set; }   //Id ингредиента

        [Required]                              //Поле является обязательным 
        [StringLength(50)]                      //Длина поля
        public string Name { get; set; }        //Название ингредиента

        public decimal Price { get; set; }      //Цена ингредиента

        public int Massa { get; set; }          //Масса ингредиента

        public string Picture { get; set; }     //Картинка ингредиента

        public int Kategori_FK { get; set; }    //Id категории ингредиента
        
        public bool availability { get; set; }  //Наличие ингредиента

        public virtual ICollection<Composition> Compositions { get; set; }

        public virtual Kategori Kategori { get; set; }  //Категория ингредиента
    }
}
