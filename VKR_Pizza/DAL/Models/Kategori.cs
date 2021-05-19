using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VKR_Pizza.DAL.Models
{
    public class Kategori
    {
        public Kategori()
        {
            Ingredients = new HashSet<Ingredient>();
        }

        [Key]                                   //Первичный ключ
        public int KategoriId { get; set; }     //Id категории

        [Required]                              //Поле является обязательным
        [StringLength(20)]                      //Длина поля
        public string Name { get; set; }        //Название категории

        public string Picture { get; set; }     //Картинка категории

        public virtual ICollection<Ingredient> Ingredients { get; set; }
    }
}
