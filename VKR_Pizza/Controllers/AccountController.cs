using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using VKR_Pizza.DAL.Models;
using Microsoft.AspNetCore.Identity;
using VKR_Pizza.Service;

namespace VKR_Pizza.Controllers
{
    [Produces("application/json")]
    public class AccountController : Controller
    {
        private readonly UserManager<User> _userManager;        //Предоставляет API-интерфейсы для управления Пользователем в хранилище
        private readonly SignInManager<User> _signInManager;    //Предоставляет API-интерфейсы для входа пользователя

        public AccountController(UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        private string CreateEmail(string url)
        {
            string str = "";
            str += "<table border='0' cellpadding='0' cellspacing='0' width='100%' style='background-color: #eff2f5;border-collapse:collapse!important;table-layout:fixed'>";
            str += "<thead><tr><td align='center'>Добро пожаловать!</td></tr></thead>";
            str += "<tbody><tr align='center'><td>";
            str += "<img alt='Спасибо за регистрацию' border='0' height='155' width='268' src='https://resize.yandex.net/mailservice?url=https%3A%2F%2Fpic.rutube.ru%2Fgenericimage%2Fec%2F51%2Fec513e3c4fb07740b8a7a2825a00d063.gif&amp;proxy=yes&amp;key=1aa0a6ed0413e7a49f132584a02c563b'>";
            str += "</td></tr><tr align='center'><td>";
            str += "<a href='"+ url +"' style='text-decoration:none;'><b>Активировать аккаунт</b></a>";
            str += "</td></tr><tr align='center'><td><hr><p style='margin:10px;'>Мы очень рады новому пользователю!</p></td></tr></tbody></table>";
            return str;
        }

        [HttpPost]
        [Route("api/Account/Register")]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel model)   //Регистрация
        {
            if (ModelState.IsValid) //Проверка на ошибки
            {
                User user = new User { PhoneNumber = model.PhoneNumber, Email = model.Email, FIO = model.FIO, UserName = model.Email, Bonus=0 };
                //Добавление нового пользователя
                var result = await _userManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    //Генерация токена для пользователя
                    var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                    var callbackUrl = Url.Action("ConfirmEmail","Account", new { userId = user.Id, code = code }, protocol: HttpContext.Request.Scheme);
                    EmailService emailService = new EmailService();

                    await emailService.SendEmailAsync(model.Email, "Активация аккаунта", CreateEmail(callbackUrl));
                    await _userManager.AddToRoleAsync(user, "user");    //При регистрации роль по умолчанию user

                    var msg = new
                    {
                        message = "Для завершения регистрации проверьте электронную почту и перейдите по ссылке, указанной в письме.",
                    };
                    return Ok(msg);
                }
                else
                {
                    ModelState.AddModelError("", "Пользователь с такой почтой зарегистрирован!");
                    var errorMsg = new
                    {
                        message = "Пользователь не добавлен.",
                        error = ModelState.Values.SelectMany(e => e.Errors.Select(er => er.ErrorMessage))
                    };
                    return Ok(errorMsg);
                }
            }
            else
            {
                var errorMsg = new
                {
                    message = "Неверные входные данные.",
                    error = ModelState.Values.SelectMany(e => e.Errors.Select(er => er.ErrorMessage))
                };
                return Ok(errorMsg);
            }
        }

        [HttpGet]
        [Route("api/Account/Login")]
        public async Task<IActionResult> ConfirmEmail(string userId, string code)
        {
            if (userId == null || code == null)
            {
                return RedirectPermanent("/confirmEmail/emailError.html");
            }
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return RedirectPermanent("/confirmEmail/emailError.html");
            }
            var result = await _userManager.ConfirmEmailAsync(user, code);
            if (result.Succeeded)
            {
                return RedirectPermanent("/confirmEmail/emailOk.html");
            }
            else
                return RedirectPermanent("/confirmEmail/emailError.html");
        }

        [HttpPost]
        [Route("api/Account/Login")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)     //Авторизация
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByNameAsync(model.Email);
                if (user != null)
                {
                    //Проверяем, подтвержден ли email
                    if (!await _userManager.IsEmailConfirmedAsync(user))
                    {
                        ModelState.AddModelError("", "Вы не подтвердили свой email");
                        var errorMsg = new
                        {
                            message = "Вход не выполнен.",
                            error = ModelState.Values.SelectMany(e => e.Errors.Select(er => er.ErrorMessage))
                        };
                        return Ok(errorMsg);
                    }
                }
                var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, false);
                if (result.Succeeded)
                {
                    var msg = new
                    {
                        message = "Выполнен вход пользователем: " + model.Email,
                        user.Id,
                    };
                    return Ok(msg);
                }
                else
                {
                    ModelState.AddModelError("", "Неправильный логин и (или) пароль");
                    var errorMsg = new
                    {
                        message = "Вход не выполнен.",
                        error = ModelState.Values.SelectMany(e => e.Errors.Select(er => er.ErrorMessage))
                    };
                    return Ok(errorMsg);
                }
            }
            else
            {
                var errorMsg = new
                {
                    message = "Вход не выполнен.",
                    error = ModelState.Values.SelectMany(e => e.Errors.Select(er => er.ErrorMessage))
                };
                return Ok(errorMsg);
            }
        }

        [HttpPost]
        [Route("api/Account/logoff")]
        public async Task<IActionResult> LogOff()   //Обнуляет сессию пользователя
        {
            await _signInManager.SignOutAsync();    //Удаление куки
            var msg = new
            {
                message = "Выполнен выход."
            };
            return Ok(msg);
        }
        
        [HttpPut]
        [Route("api/Account/editProfile")]
        public async Task<IActionResult> editProfile([FromBody] ChangeProfileViewModel model)   //Изменение личных данных
        {
            if (ModelState.IsValid)
            {
                var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);
                if (result.Succeeded)
                {
                    var user = await _userManager.FindByNameAsync(model.Email);
                    user.FIO = model.FIO;
                    user.PhoneNumber = model.PhoneNumber;
                    await _userManager.UpdateAsync(user);
                    ModelState.AddModelError("", "Персональные данные успешно изменены!");
                    var msg = new
                    {
                        message = ModelState.Values.SelectMany(e => e.Errors.Select(er => er.ErrorMessage)),
                        error = false
                    };
                    return Ok(msg);
                }
                else
                {
                    ModelState.AddModelError("", "Неправильный пароль");
                    var errorMsg = new
                    {
                        message = ModelState.Values.SelectMany(e => e.Errors.Select(er => er.ErrorMessage)),
                        error = true
                    };
                    return Ok(errorMsg);
                }
            }
            else
            {
                var msg = new
                {
                    message = ModelState.Values.SelectMany(e => e.Errors.Select(er => er.ErrorMessage)),
                    error = true
                };
                return Ok(msg);
            }
        }

        [HttpPost]
        [Route("api/Account/ChangePassword")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordViewModel model)     //Смена пароля
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByNameAsync(model.Email);
                IdentityResult result = await _userManager.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);
                if (result.Succeeded)
                {
                    ModelState.AddModelError("", "Пароль успешно изменен!");
                    var msg = new
                    {
                        message = ModelState.Values.SelectMany(e => e.Errors.Select(er => er.ErrorMessage)),
                        error = false
                    };
                    return Ok(msg);
                }
                else
                {
                    ModelState.AddModelError("", "Неправильный старый пароль и (или) новый пароль совпадает со старым");
                    var msg = new
                    {
                        message = ModelState.Values.SelectMany(e => e.Errors.Select(er => er.ErrorMessage)),
                        error = true
                    };
                    return Ok(msg);
                }
            }
            else
            {
                var msg = new
                {
                    message = ModelState.Values.SelectMany(e => e.Errors.Select(er => er.ErrorMessage)),
                    error = true
                };
                return Ok(msg);
            }
        }


        [HttpPost]
        [Route("api/Account/isAuthenticated")]
        public async Task<IActionResult> LogisAuthenticatedOff()    //Проверки текущей сессии пользователя
        {
            User usr = await GetCurrentUserAsync();
            var id = usr == null ? "null" : usr.Id;
            var role = usr == null ? "null" : _userManager.GetRolesAsync(usr).Result[0];    //Узнаем роль
            var fio = usr == null ? "null" : usr.FIO;
            var email = usr == null ? "null" : usr.Email;
            var phone = usr == null ? "null" : usr.PhoneNumber;
            var bonus = usr == null ? -1 : usr.Bonus;
            var url = "null";
            switch(role)
            {
                case "moder": url = "editOrder.html;Активные заказы"; break;
                case "user": url = "myAccount.html;Личный кабинет"; break;
                case "admin": url = "adminkey/adminPanelOne.html;Админ Панель"; break;
            }
            var message = usr == null ? "Вы Гость. Пожалуйста, выполните вход." : "Вы вошли как: " + email;
            var msg = new
            {
                message,
                id,
                role,
                fio,
                email,
                phone,
                bonus,
                url
            };
            return Ok(msg);
        }
        private Task<User> GetCurrentUserAsync() => _userManager.GetUserAsync(HttpContext.User);    //Возвращает пользователя, либо null
    }
}
