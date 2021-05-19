//Работа с куки
var jobCoocies = {
    name: ['userdata', 'basketb', 'buildPizza'],   //Пользовательские, корзина

    //Считывание из куки
    readCookies: function (id) {
        var dataArr = $.cookie(jobCoocies.name[id]);       //Считываем данные из куков 
        if (dataArr != null) 
            return JSON.parse(dataArr);                    //Получаем данные из куки
        else return null;
    },

    //Запись в куки
    writeCookies: function (data, id) {
        if (data)
            var str = JSON.stringify(data);                 //Конвертируем в строку 
        else var str = null;
        $.cookie(jobCoocies.name[id], str, { path: '/' });  //Записываем массив в куки
    },
}

var users = {

    //Выход из личного кабинета
    logOff: function () {
        $.ajax({
            url: 'api/Account/logoff',
            type: 'POST',
            contentType: 'application/json',
            success: function (data) {
                jobCoocies.writeCookies(null, 0);
                $(location).attr('href', "index.html");
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },
}