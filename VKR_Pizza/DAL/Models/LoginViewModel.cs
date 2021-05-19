using System.ComponentModel.DataAnnotations;

namespace VKR_Pizza.DAL.Models
{
    public class LoginViewModel     //Данные для авторизации
    {
        [Required(ErrorMessage = "Поле E-mail обязательно для заполнения")] //Поле является обязательным
        [Display(Name = "Электронная почта")]   //Параметр отображения
        public string Email { get; set; }       //Почта

        [Required(ErrorMessage = "Поле Пароль обязательно для заполнения")] //Поле является обязательным
        [DataType(DataType.Password)]           //Отображает символы с использованием маски
        [Display(Name = "Пароль")]              //Параметр отображения
        public string Password { get; set; }    //Пароль

        [Display(Name = "Запомнить?")]          //Параметр отображения
        public bool RememberMe { get; set; }    //Запомнить меня

        public string ReturnUrl { get; set; }   //Ссылка на какую страницу вернутся, после авторизации
    }
}
