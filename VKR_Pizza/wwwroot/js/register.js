$(document).ready(function () {     //Выполняется при загрузки страницы
    $("#regPhone").mask("(999) 999-99-99");    //Маска для ввода телефона
});

var user = {
    //Регистрация
    Register: function () {
        var fio = $('#regFIO').val();
        var phone = $('#regPhone').val();
        var email = $('#regEmail').val();
        var password = $('#regPassword').val();
        var passwordConfirm = $('#regPasswordConfirm').val();
        phone = phone.replace(/\-/g, '');   //Удаляем дефисы
        phone = phone.replace(/\(/g, '');   //Удаляем скобки
        phone = phone.replace(/\)/g, '');   //Удаляем скобки
        phone = phone.replace(/\ /g, '');   //Удаляем пробел
        $.ajax({
            url: 'api/Account/Register',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                fio: fio,
                phonenumber: phone,
                email: email,
                password: password,
                passwordConfirm: passwordConfirm
            }),
            success: function (data) {
                if (!data.error) {      //Если ошибка отсутсвует
                    alert(data.message);
                    $(location).attr('href', "index.html");
                }
                else {
                    let html = "";  //Текст вставки
                    html += "<div class=\"alert alert-danger\" role=\"alert\">";
                    html += data.message;
                    html += "<strong>";
                    for (var i in data.error) {
                        html += "<br>" + data.error[i];
                    }
                    html += "</strong>";
                    html += "</div>";
                    $('#messageregister').html(html);   //Добавление строк в html
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },

    //Авторизация
    Login: function () {
        var email = $('#inputEmail').val();
        var password = $('#inputPassword').val();
        $.ajax({
            url: 'api/Account/Login',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                email: email,
                password: password,
                rememberMe: exampleCheck.checked,
            }),
            success: function (data) { 
                if (!data.error) {  //Если ошибка отсутсвует
                    alert(data.message);
                    $(location).attr('href', "index.html");
                }
                else {  //Если ошибка есть
                    let html = "";  //Текст вставки
                    html += "<div class=\"alert alert-danger\" role=\"alert\">";
                    html += data.message;   //Сообщение об ошибкой
                    html += "<strong>";
                    for (var i in data.error) {
                        html += "<br>" + data.error[i]; //Описание самой ошибка
                    }
                    html += "</strong>";
                    html += "</div>";
                    $('#messagelogin').html(html);   //Добавление строк в html
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },

    //Проверка полей при регистрации
    CheckInput: function () {
        var fio = $('#regFIO').val();
        var email = $('#regEmail').val();
        var password = $('#regPassword').val();
        var passwordConfirm = $('#regPasswordConfirm').val();
        if (fio.search(/^[^0-9]{2,100}$/i) == 0) {
            $("#regFIO").removeClass("is-invalid");
            $("#regFIO").addClass("is-valid");
        }
        else {
            $("#regFIO").removeClass("is-valid");
            $("#regFIO").addClass("is-invalid");
        }
        if (email.search(/^[a-z0-9_-]+@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/i) == 0) {
            $("#regEmail").removeClass("is-invalid");
            $("#regEmail").addClass("is-valid");
        }
        else {
            $("#regEmail").removeClass("is-valid");
            $("#regEmail").addClass("is-invalid");
        }
        if (password.search(/^\w+\w+\w+\w+\w+\w+$/i) == 0) {
            $("#regPassword").removeClass("is-invalid");
            $("#regPassword").addClass("is-valid");
        }
        else {
            $("#regPassword").removeClass("is-valid");
            $("#regPassword").addClass("is-invalid");
        }
        if (password == passwordConfirm)
        {
            $("#regPasswordConfirm").removeClass("is-invalid");
            $("#regPasswordConfirm").addClass("is-valid");
        }
        else {
            $("#regPasswordConfirm").removeClass("is-valid");
            $("#regPasswordConfirm").addClass("is-invalid");
        }
    },
};