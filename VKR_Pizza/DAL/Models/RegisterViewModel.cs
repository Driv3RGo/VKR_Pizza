using System.ComponentModel.DataAnnotations;

namespace VKR_Pizza.DAL.Models
{
    public class RegisterViewModel      //Данные для регистрации
    {
        [Required(ErrorMessage = "Поле ФИО обязательно для заполнения")]    //Поле является обязательным
        [Display(Name = "ФИО")]             //Параметр отображения
        public string FIO { get; set; }     //ФИО пользователя

        [Required(ErrorMessage = "Поле Номер телефона обязательно для заполнения")] //Поле является обязательным
        [Display(Name = "Номер телефона")]      //Параметр отображения
        public string PhoneNumber { get; set; } //Номер телефона пользователя

        [Required(ErrorMessage = "Поле Почта обязательно для заполнения")] //Поле является обязательным
        [Display(Name = "Email")]           //Параметр отображения
        [RegularExpression(@"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}", ErrorMessage = "Некорректный адрес")] //Проверка, введенного значения, по регулярному выражению
        public string Email { get; set; }   //Почта пользователя

        [Required(ErrorMessage = "Поле Пароль обязательно для заполнения")] //Поле является обязательным
        [DataType(DataType.Password)]       //Отображает символы с использованием маски
        [Display(Name = "Пароль")]          //Параметр отображения
        public string Password { get; set; }//Пароль

        [Required(ErrorMessage = "Поле Подтверждение пароля обязательно для заполнения")]   //Поле является обязательным
        [Compare("Password", ErrorMessage = "Пароли не совпадают")] //Проверка, что пароли совпадают
        [DataType(DataType.Password)]               //Отображает символы с использованием маски
        [Display(Name = "Подтвердить пароль")]      //Параметр отображения
        public string PasswordConfirm { get; set; } //Повтор пароля
    }
}
