using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VKR_Pizza.DAL.Models
{
    public class SizePizza
    {
        public SizePizza()
        {
            Order_lines = new HashSet<Order_line>();
        }

        [Key]                                   //Первичный ключ
        public int SizeId { get; set; }         //Id размера

        [Required]                              //Поле является обязательным
        [StringLength(20)]                      //Длина поля
        public string Name { get; set; }        //Название размера

        [Required]                              //Поле является обязательным
        public int Size { get; set; }           //Размер

        [Required]                              //Поле является обязательным
        public double K { get; set; }           //Коэффициент размера

        public virtual ICollection<Order_line> Order_lines { get; set; }
    }
}
