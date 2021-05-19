using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VKR_Pizza.DAL.Models
{
    public class Order
    {
        public Order()
        {
            Order_lines = new HashSet<Order_line>();
        }

        [Key]
        public int OrderID { get; set; }            //Id заказа

        public DateTime DataBegin { get; set; }     //Дата поступления заказа

        public string User_FK { get; set; }         //Id пользователя сделавшего заказ

        public decimal Price { get; set; }          //Цена заказа

        public int Status_FK { get; set; }          //Id статуса заказа

        public int Payment_FK { get; set; }         //Id способа оплаты

        [Required(ErrorMessage = "Поле обязательно для заполнения")]    //Поле является обязательным
        [StringLength(250)]                         //Длина поля
        public string Address { get; set; }         //Адрес, по которому доставить заказ

        public DateTime? DataEnd { get; set; }      //Дата, когда заказ был выполнен

        [StringLength(250)]
        public string Message { get; set; }         //Комментарий к заказу

        public string Moder_FK { get; set; }        //Id оператора, обслужившего заказ

        public virtual User User { get; set; }      //Пользователь сделавший заказ

        public virtual ICollection<Order_line> Order_lines { get; set; }

        public virtual Status Status { get; set; }      //Статус заказа

        public virtual Payment Payment { get; set; }    //Способ оплаты
    }
}
