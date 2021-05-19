$(document).ready(function () {     //Выполняется при загрузки страницы  
    loadingTabs.init(1);
});

//Загрузка вкладок
var loadingTabs = {

    //Содержимое
    init: function (id) {
        let html = "";
        switch (id) {
            case 1: {
                html += "<h1>Корзина</h1><hr />";
                html += "<div id=\"fullBk\"></div>";
                html += "<div id=\"sum-order\" class=\"itog-sum\"></div>";
                html += "<div class=\"row back-button-next\">";
                html += "<button type=\"button\" class=\"btn btn-back\" onclick=\"location.href = 'index.html'\">Вернуться в меню</button>";
                html += "<button id=\"bask-orderr\" type=\"button\" class=\"btn btn-next\" onclick=\"loadingTabs.init(2)\">Оформить заказ ></button></div>";
                $('#basket-order').html(html);
                basket.loadBasket(1);
            } break; 
            case 2: {
                var user = jobCoocies.readCookies(0);
                html += "<h1>Оформление заказа</h1>";
                html += "<form class=\"decoration-order was-validated\">";
                html += "<div class=\"form-group row\">";
                html += "<label class=\"col-sm-3 col-form-label\">ФИО</label>";
                html += "<div class=\"col-sm-7\">";
                html += "<input type=\"text\" readonly disabled class=\"form-control is-valid\" value=\""+ user.fio +"\" required></div></div>";
                html += "<div class=\"form-group row\">";
                html += "<label class=\"col-sm-3 col-form-label\">Почта</label>";
                html += "<div class=\"col-sm-7\">";
                html += "<input type=\"email\" readonly disabled class=\"form-control is-valid\" value=\""+ user.email +"\" required></div></div>";
                html += "<div class=\"form-group row\">";
                html += "<label class=\"col-sm-3 col-form-label\">Адрес Доставки</label>";
                html += "<div class=\"col-sm-7\">";
                html += "<input id=\"adress\" type=\"text\" class=\"form-control is-invalid\" maxlength=\"200\" required onkeyup=\"order.checkParams()\"></div></div>";
                html += "<div class=\"form-group row\">";
                html += "<label class=\"col-sm-3 col-form-label\">Комментарий к заказу</label>";
                html += "<div class=\"col-sm-7\">";
                html += "<textarea id=\"textarea\" class=\"form-control\" maxlength=\"250\" rows=\"5\"></textarea>";
                html += "<div><span id=\"symb_counter\">250</span></div></div></div>";
                html += "<div class=\"pay-metod\"><div><h3>Способ оплаты</h3></div>";
                html += "<div id=\"payController\"></div>";
                html += "</div></form>";
                html += "<div class=\"row back-button-next\">";
                html += "<button type=\"button\" class=\"btn btn-back\" onclick=\"loadingTabs.init(1)\">< Назад к корзине</button>";
                html += "<button id=\"submit\" type=\"button\" class=\"btn btn-next\" onclick=\"order.addOrder()\" disabled>Оформить заказ на " + basket.sum + " Р ></button></div>";
                $('#basket-order').html(html);
                loadingTabs.getPay();
            } break;
            case 3: {
                var arr = order.compliteOrder.dataBegin.split("T");
                html += "<div class=\"itog-ordera\">";
                html += "<h1>Заказ № " + order.compliteOrder.orderID +"</h1>";
                html += "<h4>Статус заказа: <span>Заказ в обработке</span></h4>";
                html += "<p>Ваш заказ будет доставлен в течение 60 минут. Детализация заказа отправлена вам на почту.</p>";
                html += "<div class=\"itog-ordera-adres\">";
                html += "<h5>Дата заказа: </h5>";
                html += "<span>" + arr[0] + " " + arr[1].substring(0, arr[1].indexOf(".")) + "</span></div>";
                html += "<div class=\"itog-ordera-adres\">";
                html += "<h5>Адрес доставки: </h5>";
                html += "<span>" + order.compliteOrder.address + "</span></div>";
                html += "<div class=\"itog-ordera-adres\">";
                html += "<h5>Комментарий: </h5>";
                html += "<span>" + order.compliteOrder.message + "</span></div>";
                html += "<div class=\"itog-ordera-adres\"><h5> Состав заказа на сумму <span>" + basket.sum + " ₽</span></h5></div>";
                html += "<div id=\"fullBk\"></div></div>";
                $('#basket-order').html(html);
                basket.loadBasket(3);
            } break;
        }
        this.initStep(id);
    },

    //Шаги
    initStep: function (id) {
        let html = "";
        switch (id) {
            case 1: {
                html += "<li class=\"li_item\">";
                html += "<span class=\"li_item-img li_item-img-active\">1</span>";
                html += "<span class=\"li_item-name li_item-name-active\">Корзина</span></li>";
                html += "<li class=\"li_item\">";
                html += "<span class=\"li_item-img\">2</span>";
                html += "<span class=\"li_item-name\">Оформление заказа</span></li>";
                html += "<li class=\"li_item-end\">";
                html += "<span class=\"li_item-img\">3</span>";
                html += "<span class=\"li_item-name\">Заказ принят</span></li>";
            } break;
            case 2: {
                html += "<li class=\"li_item li_item-active\">";
                html += "<span class=\"li_item-img li_item-img-active\"><i class=\"bi bi-check2\"></i></span>";
                html += "<span class=\"li_item-name li_item-name-active\">Корзина</span></li>";
                html += "<li class=\"li_item\">";
                html += "<span class=\"li_item-img li_item-img-active\">2</span>";
                html += "<span class=\"li_item-name li_item-name-active\">Оформление заказа</span></li>";
                html += "<li class=\"li_item-end\">";
                html += "<span class=\"li_item-img\">3</span>";
                html += "<span class=\"li_item-name\">Заказ принят</span></li>";
            } break;
            case 3: {
                html += "<li class=\"li_item li_item-active\">";
                html += "<span class=\"li_item-img li_item-img-active\"><i class=\"bi bi-check2\"></i></span>";
                html += "<span class=\"li_item-name li_item-name-active\">Корзина</span></li>";
                html += "<li class=\"li_item li_item-active\">";
                html += "<span class=\"li_item-img li_item-img-active\"><i class=\"bi bi-check2\"></i></span>";
                html += "<span class=\"li_item-name li_item-name-active\">Оформление заказа</span></li>";
                html += "<li class=\"li_item-end\">";
                html += "<span class=\"li_item-img li_item-img-active\"><i class=\"bi bi-check2\"></i></span>";
                html += "<span class=\"li_item-name li_item-name-active\">Заказ принят</span></li>";
            } break;
        }
        $('#step-order').html(html);
    },

    //Способ оплаты
    getPay: function () {
        $.ajax({                    //Выполняет асинхронный HTTP (Ajax) запрос
            url: '/api/payMetod',   //URL адрес, на который будет отправлен Ajax запрос
            type: 'GET',            //Определяет тип запроса
            dataType: 'HTML',       //Тип данных, ожидаемых от сервера
            success: function (data) {  //Функция, которая будет вызвана в случае успешного завершения запроса, data - данные, которые прислал сервер
                var pay = JSON.parse(data); //Разбирает строку JSON
                let html = "";
                for (var i in pay) {
                    html += "<div class=\"form-check\">";
                    html += "<input id=\"pay-check" + pay[i].paymentId + "\" class=\"form-check-input\" value=\"" + pay[i].paymentId +"\" name=\"options\" type=\"radio\" onclick=\"order.checkParams()\"/>";
                    html += "<label class=\"form-check-label\" for=\"pay-check" + pay[i].paymentId + "\"> " + pay[i].name +" </label></div>";
                }
                $('#payController').html(html);  
            },
            error: function (xhr, ajaxOptions, thrownError) {   //Функция, исполняемая в случае неудачного запроса
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },
};

//Корзина
var basket = {
    sum: 0,         //Сумма корзины
    n: 0,           //Кол-во пицц в корзине

    /* Загрузить корзину */
    loadBasket: function (step) { 
        var data = jobCoocies.readCookies(1);
        if (data) {                                //Проверяем наличие данных
            let html = "";
            this.sum = 0;
            for (var i in data) {
                this.n += data[i].pCount;
                this.sum += data[i].sPrice * data[i].pCount;
                html += "<div id=\"blok" + data[i].sId + "-" + data[i].pId + "\" class=\"basket-information\">";
                html += "<img src=\"image/product/" + data[i].pImage + "\"/>";
                html += "<div class=\"INF\"><h3>" + data[i].pName + "</h3>";
                html += "<div class=\"INF-size\">" + data[i].sName + " " + data[i].sSize + " см</div></div>";
                html += "<div class=\"INF-button\">";
                if (step == 1) {
                    html += "<div class=\"btn-group btn-group-toggle\" data-toggle=\"buttons\">";
                    html += "<label class=\"btn add-btn\">";
                    html += "<input type=\"radio\" autocomplete=\"off\" onclick=\"basket.minusPizza(" + data[i].sPrice + ", " + data[i].sId + ", " + data[i].pId + ")\"> – </label>";  //Кнопка уменьшить кол-во
                }
                html += "<label id=\"count" + data[i].sId + "-" + data[i].pId + "\" class=\"btn add-btn disabled\">" + data[i].pCount + "</label>"; //Количество
                if (step == 1) {
                    html += "<label class=\"btn add-btn\">";
                    html += "<input type=\"radio\" autocomplete=\"off\" onclick=\"basket.sumPizza(" + data[i].sPrice + ", " + data[i].sId + ", " + data[i].pId + ")\"> + </label></div>";  //Кнопка увеличить кол-во   
                }
                html += "</div><div class=\"INF-price\">";
                html += "<span id=\"price" + data[i].sId + "-" + data[i].pId + "\">" + data[i].sPrice * data[i].pCount + " ₽</span></div>";
                if (step == 1)
                    html += "<button class=\"btn INF-del\" onclick=\"basket.removeBlock(" + data[i].sId + ", " + data[i].pId + ")\"><i class=\"bi bi-trash\"></i></button>";  //Кнопка удалить
                html += "</div><hr id=\"hr" + data[i].sId + "-" + data[i].pId + "\"/>";
            }
            $('#fullBk').html(html);
            if (step == 1)
                $('#sum-order').html("<h2>Сумма заказа: <span>" + this.sum + " ₽</span></h2>");
        }
        else {
            let html = "<div class='empty-bask'>";
            html += "<img src=\"image/EmptyBask.png\"/>";
            html += "<h2>Ой, пусто!</h2></div>"
            $('#bask-orderr').prop("disabled", true);
            $('#fullBk').html(html);
        }
    },

    /* Убавить количество пицц */
    minusPizza: function (price, sId, pId) {
        var data = jobCoocies.readCookies(1);   //Считываем данные с куками
        var j = data.findIndex(item => item.sId == sId && item.pId == pId);   //Ищем элемент в куках
        basket.sum -= price;                                                  //Уменьшаем итоговую сумму
        this.n--;                                                             //Уменьшаем количество
        //Проверка, остались ли пиццы в корзине
        if (this.n == 0) {
            let html = "<div class='empty-bask'>";
            html += "<img src=\"image/EmptyBask.png\"/>";
            html += "<h2>Ой, пусто!</h2></div>"
            $('#fullBk').html(html);                    //Выводим надпись пусто
            $('#sum-order').html("");                   //Убираем итоговую сумму
            $('#bask-orderr').prop("disabled", true);   //Блокируем кнопку
            jobCoocies.writeCookies(null, 0);           //Удаляем куки
        }
        else {
            if (j != -1) {
                //Проверяем количество данной пиццы, если больше 1
                if (data[j].pCount != 1) {
                    data[j].pCount--;                                               //Уменьшаем кол-во
                    $('#count' + sId + "-" + pId + '').html(data[j].pCount);        //Отображаем новое кол-во
                    $('#price' + sId + "-" + pId + '').html(data[j].pCount * price + " ₽");//Отображаем новую цену
                }
                else {
                    $("#blok" + sId + "-" + pId).remove();          //Удаляем блок с данной пиццей из корзины
                    $("#hr" + sId + "-" + pId).remove();
                    data.splice(j, 1);                              //Удаляем пиццу из куки
                }
                jobCoocies.writeCookies(data, 1);           //Переписываем куки
                $('#sum-order').html("<h2>Сумма заказа: <span>" + basket.sum + " ₽</span></h2>");
            }
        }
    },

    /* Прибавить количество пицц */
    sumPizza: function (price, sId, pId) {
        var data = jobCoocies.readCookies(1);                         //Считываем данные из куки
        var j = data.findIndex(item => item.sId == sId && item.pId == pId);   //Ищем элемент в куках
        basket.sum += price;                                                  //Увеличиваем общую сумму
        this.n++;                                                             //Увеличиваем количество
        if (j != -1) {
            data[j].pCount++;                                               //Увеличиваем кол-во пицц данного вида
            $('#count' + sId + "-" + pId + '').html(data[j].pCount);        //Отображаем новое кол-во
            $('#price' + sId + "-" + pId + '').html(data[j].pCount * price + " ₽");//Отображаем новую цену
            jobCoocies.writeCookies(data, 1);
        }  
        $('#sum-order').html("<h2>Сумма заказа: <span>" + basket.sum + " ₽</span></h2>");
    },

    //Удаление из корзины
    removeBlock: function (sId, pId) {
        var data = jobCoocies.readCookies(1);                         //Считываем куки
        var j = data.findIndex(item => item.sId == sId && item.pId == pId);   //Ищем элемент в куках
        basket.sum -= data[j].pCount * data[j].sPrice;                        //Уменьшаем итоговую сумму
        basket.n -= data[j].pCount;                                           //Уменьшаем кол-во
        //Проверка, остались ли пиццы в корзине
        if (this.n == 0) {
            let html = "<div class='empty-bask'>";
            html += "<img src=\"image/EmptyBask.png\"/>";
            html += "<h2>Ой, пусто!</h2></div>"
            $('#fullBk').html(html);                    //Выводим надпись пусто
            $('#sum-order').html("");                   //Убираем итоговую сумму
            $('#bask-orderr').prop("disabled", true);   //Блокируем кнопку
            jobCoocies.writeCookies(null, 1);   //Удаляем куки
        }
        else {
            $("#blok" + sId + "-" + pId).remove();      //Удаляем блок с данной пиццей из корзины
            $("#hr" + sId + "-" + pId).remove();
            data.splice(j, 1);                          //Удаляем пиццу из куки
            jobCoocies.writeCookies(data, 1);   //Переписываем куки
            $('#sum-order').html("<h2>Сумма заказа: <span>" + basket.sum + " ₽</span></h2>");
        }     
    },
};

//Вывод сколько осталось еще вводить символов
$('#textarea').bind('input', function () {
    $('#symb_counter').html(250 - $(this).val().length);
});

var order = {
    compliteOrder: {},      //Заказ с сервера

    /* Проверка заполнены ли поля */
    checkParams: function () {
        var adress = $('#adress').val();
        if (adress.length != 0 && $('input[name="options"]').is(':checked')) {
            $('#submit').removeAttr('disabled');
        } else {
            $('#submit').attr('disabled', 'disabled');
        }
    },

    /* Оформить заказ */
    addOrder: function () {
        var zakaz = {};
        var adress = $('#adress').val();
        var message = $('#textarea').val();
        var value = $('input[name="options"]:checked').val();
        var data = jobCoocies.readCookies(1);           //Считываем данные корзины из куки
        var dataUser = jobCoocies.readCookies(0);      //Считываем данные пользователя из куки
        zakaz.address = adress;         //Адрес
        zakaz.message = message;        //Комментарий к заказу
        zakaz.payment_FK = value;       //Способ оплаты
        zakaz.user_FK = dataUser.id;    //id пользователя
        zakaz.price = basket.sum;       //Общая сумма
        var elements = [];              //Состав заказа
        for (var i in data) {
            var element = {};
            element.pId = data[i].pId;      //id пиццы
            element.sId = data[i].sId;      //id размера
            element.k = data[i].pCount;     //Кол-во пицц
            element.price = data[i].sPrice; //Цена
            if (data[i].ing)
                element.ing = data[i].ing;
            elements.push(element);
        }
        zakaz.sostav = elements;
        $.ajax({                    //Выполняет асинхронный HTTP (Ajax) запрос
            url: '/api/order',      //URL адрес, на который будет отправлен Ajax запрос
            type: 'POST',           //Определяет тип запроса
            contentType: 'application/json',    //При отправке Ajax запроса, данные передаются в том виде, в котором указаны в данном параметре
            data: JSON.stringify(zakaz),        //Данные, которые будут переданы на сервер, JSON.stringify - преобразует значение JavaScript в строку JSON,
            success: function (data) {          //Функция, которая будет вызвана в случае успешного завершения запроса, data - данные, которые прислал сервер
                order.compliteOrder = data;
                loadingTabs.init(3);
                jobCoocies.writeCookies(null, 1);   //Удаляем куки
            },
        });
    },
};