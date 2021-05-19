using MimeKit;
using MailKit.Net.Smtp;
using System.Threading.Tasks;

namespace VKR_Pizza.Service
{
    public class EmailService
    {
        //Почта получателя, тема письма и сообщение
        public async Task SendEmailAsync(string email, string subject, string message)
        {
            var emailMessage = new MimeMessage();   //Создания объекта отправляемого сообщения

            emailMessage.From.Add(new MailboxAddress("Доставка пиццы", "DimaASDima@yandex.ru"));    //Отправитель
            emailMessage.To.Add(new MailboxAddress("", email));                                     //Получатель
            emailMessage.Subject = subject;                                                         //Тема письма
            emailMessage.Body = new BodyBuilder() { 
                HtmlBody = message }
            .ToMessageBody();                         //Содержание письма


            using (var client = new SmtpClient())
            {
                await client.ConnectAsync("smtp.gmail.com", 587, false);                             //Подключение к серверу
                await client.AuthenticateAsync("vkr.pizza2021@gmail.com", "Fyfcnfcbz2004?");             //Аунтификация
                await client.SendAsync(emailMessage);                                               //Отправка письма
                await client.DisconnectAsync(true);                                                 //Отключение
            }
        }
    }
}
