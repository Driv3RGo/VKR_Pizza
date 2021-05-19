using System.ComponentModel.DataAnnotations;

namespace VKR_Pizza.DAL.Models
{
    public class ChangePasswordViewModel
    {
        public string Email { get; set; }

        [Required(ErrorMessage = "Поле Новый пароль обязательно для заполнения")] //Поле является обязательным
        [DataType(DataType.Password)]       //Отображает символы с использованием маски
        public string NewPassword { get; set; }

        [Required(ErrorMessage = "Поле Подтверждение нового пароля обязательно для заполнения")]   //Поле является обязательным
        [Compare("NewPassword", ErrorMessage = "Пароли не совпадают")] //Проверка, что пароли совпадают
        public string NewPasswordConfirm { get; set; }

        [Required(ErrorMessage = "Поле Старый пароль обязательно для заполнения")] //Поле является обязательным
        [DataType(DataType.Password)]       //Отображает символы с использованием маски
        public string OldPassword { get; set; }
    }
}
