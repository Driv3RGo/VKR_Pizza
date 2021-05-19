using System.ComponentModel.DataAnnotations;

namespace VKR_Pizza.DAL.Models
{
    public class ChangeProfileViewModel
    {
        public string Email { get; set; }

        [Required(ErrorMessage = "Поле ФИО обязательно для заполнения")]    //Поле является обязательным
        public string FIO { get; set; }     //ФИО пользователя

        [Required(ErrorMessage = "Поле Номер телефона обязательно для заполнения")] //Поле является обязательным
        public string PhoneNumber { get; set; } //Номер телефона пользователя

        [Required(ErrorMessage = "Поле Пароль обязательно для заполнения")] //Поле является обязательным
        [DataType(DataType.Password)]       //Отображает символы с использованием маски
        public string Password { get; set; }
    }
}
