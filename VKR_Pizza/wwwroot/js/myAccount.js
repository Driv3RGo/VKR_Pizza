$(document).ready(function () {
    loading.init();
});

var loading = {
    pageId: 1,  //Номер текущей страницы

    //Начальная инициализация
    init: function () {
        User.userInfo = jobCoocies.readCookies(0);
        let html = "";  //Текст вставки
        let arr = User.userInfo.url.split(';');
        html += "<ul class=\"navbar-nav mr-auto\"><li class=\"nav-item active\">";
        html += "<a class=\"nav-link\">" + arr[1] + "</a></li></ul>";
        html += "<div class=\"mr-sm-2 text_log\">" + User.userInfo.message + "</div>";
        html += "<button class=\"btn btn-outline-info my-2 my-sm-0\" onclick=\"users.logOff()\" type=\"submit\">Выйти</button>";
        $('#login').html(html);     
        loading.swapPage(1);
    },

    //Смена страницы
    swapPage: function (id) {
        $("#listPage" + loading.pageId).removeClass("active");
        $("#listPage" + id).addClass("active");
        loading.pageId = id;
        let html = "";
        switch (id) {
            case 1: {
                html += "<h3>Персональные данные</h3>";
                html += "<div id='errormsg'></div>";
                html += "<form><div class=\"form-group\">";
                html += "<label>Фамилия Имя Отчество<span class=\"text-danger font-weight-bold\">*</span></label>";
                html += "<input type=\"text\" id='inputFIO' class=\"form-control\" placeholder=\"Введите ФИО\" value='" + User.userInfo.fio + "'></div>";
                html += "<div class=\"form-group\">";
                html += "<label>Номер телефона<span class=\"text-danger font-weight-bold\">*</span></label>";
                html += "<input type=\"tel\" id='inputPhone' class=\"form-control\" placeholder=\"(999) 999-99-99\" value='" + User.userInfo.phone + "'></div>";
                html += "<div class=\"form-group\"><label>E-mail</label>";
                html += "<input type=\"email\" class=\"form-control\" placeholder=\"Введите email\" value='" + User.userInfo.email + "' readonly></div>";
                html += "<label>Количество бонусов</label>";
                html += "<input type=\"text\" class=\"form-control\" readonly value='" + User.userInfo.bonus + "'></div>";
                html += "<div class=\"form-group\">";
                html += "<label>Текущий пароль<span class=\"text-danger font-weight-bold\">*</span></label>";
                html += "<input type=\"password\" id='inputPassword' class=\"form-control\" placeholder=\"Введите текущий пароль\"></div>";
                html += "<button type='button' class=\"btn btn-save-comp\" onclick=\"User.editUser()\">Сохранить изменения</button></form>";
            } break;
            case 2: {
                html += "<h3>История заказов</h3>";
                html += "<div class=\"w-100 menu-nav-block\">";
                html += "<div class=\"btn-group btn-group-toggle\" data-toggle=\"buttons\">";
                html += "<label class=\"btn active menu-filter\">";
                html += "<input type=\"radio\" name=\"options\" value=\"1\" autocomplete=\"off\" onclick=\"loading.swapTab()\" checked> Все</label>";
                html += "<label class=\"btn menu-filter\">";
                html += "<input type=\"radio\" name=\"options\" value=\"2\" autocomplete=\"off\" onclick=\"loading.swapTab()\"> Текущие</label>";
                html += "<label class=\"btn menu-filter\">";
                html += "<input type=\"radio\" name=\"options\" value=\"3\" autocomplete=\"off\" onclick=\"loading.swapTab()\"> Завершенные</label></div></div>";
                html += "<table class=\"table\">";
                html += "<thead><tr><th class=\"w-30\">Номер заказа</th>";
                html += "<th class=\"w-15\">Дата</th>";
                html += "<th class=\"w-15\">Количество</th>";
                html += "<th class=\"w-15\">Сумма</th>";
                html += "<th class=\"w-25\">Статус</th></tr></thead></table>";
                html += "<div id=\"table-list-order\"><div class='empty-bask'></div></div>";
            } break;
            case 3: {
                html += "<h3>Сменить пароль</h3>";
                html += "<div id='errormsg'></div>";
                html += "<form><div class=\"form-group\">";
                html += "<label>Старый пароль<span class=\"text-danger font-weight-bold\">*</span></label>";
                html += "<input id='inputoldPassword' type=\"password\" class=\"form-control\" placeholder=\"Введите старый пароль\"></div>";
                html += "<div class=\"form-group\">";
                html += "<label>Новый пароль<span class=\"text-danger font-weight-bold\">*</span></label>";
                html += "<input id='inputnewPassword' type=\"password\" class=\"form-control\" placeholder=\"Введите новый пароль\"></div>";
                html += "<div class=\"form-group\"><label>Новый пароль еще раз<span class=\"text-danger font-weight-bold\">*</span></label>";
                html += "<input id='inputnewconfPassword' type=\"password\" class=\"form-control\" placeholder=\"Введите новый пароль еще раз\"></div>";
                html += "<button type='button' class=\"btn btn-save-comp\" onclick=\"User.editPassword()\">Сохранить изменения</button></form>";
            } break;
        }
        $("#mainInformation").html(html);
        if (id == 2) {
            Order.getOrders();
            $("#mainInformation").removeClass("block-my-acc");
        }
        else $("#mainInformation").addClass("block-my-acc");
        if (id == 1) {
            $("#inputPhone").mask("(999) 999-99-99");    //Маска для ввода телефона
        }
    },

    //Смена вкладки
    swapTab: function () {
        var index = $('input[name=options]:checked').val();    //Получаем выбранный фильтр
        let html = "";
        var orders = [];
        switch (index) {
            case "1": orders = Order.listOrder; break;
            case "2": orders = Order.listOrderNew; break;
            case "3": orders = Order.listOrderEnd; break;            
        }
        if (orders.length != 0) {
            for (var i in orders)
                html += Order.viewOrder(orders[i]);
        }
        else {
            html += "<div class='empty-bask'><img src=\"image/EmptyBask.png\"/>";
            html += "<h2>Ой, пусто!</h2></div>"
        }
        $("#table-list-order").html(html);
    }
}

var User = {
    userInfo: {},   //Данные пользователя

    //Смена персональных данных
    editUser: function () {
        var fio = $("#inputFIO").val();
        var phone = $("#inputPhone").val();
        var password = $("#inputPassword").val();
        $.ajax({
            url: '/api/Account/editProfile',
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                FIO: fio,
                PhoneNumber: phone,
                Email: User.userInfo.email,
                Password: password
            }),
            success: function (data) {
                let html = "";
                if (data.error)
                    html = "<div class=\"alert alert-danger\" role=\"alert\">";
                else {
                    html = "<div class=\"alert alert-success\" role=\"alert\">";
                    User.userInfo.phone = phone;
                    User.userInfo.fio = fio;
                    jobCoocies.writeCookies(User.userInfo, 0);
                }
                for (var i in data.message) {
                    var index = Math.floor(i) + 1;
                    html += index + ". " + data.message[i] + "<br>";
                }
                html += "</div>";
                $("#errormsg").html(html);
            }
        });
    },

    //Смена пароля
    editPassword: function () {
        var passwordnew = $("#inputnewPassword").val();
        var passwordnewconf = $("#inputnewconfPassword").val();
        var passwordold = $("#inputoldPassword").val();
        $.ajax({
            url: '/api/Account/ChangePassword',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                Email: User.userInfo.email,
                NewPassword: passwordnew,
                NewPasswordConfirm: passwordnewconf,
                OldPassword: passwordold
            }),
            success: function (data) {
                let html = "";
                if (data.error)
                    html = "<div class=\"alert alert-danger\" role=\"alert\">";
                else html = "<div class=\"alert alert-success\" role=\"alert\">";
                for (var i in data.message) {
                    var index = Math.floor(i) + 1;
                    html += index + ". " + data.message[i] + "<br>";
                }
                html += "</div>";
                $("#errormsg").html(html);
            }
        });
    },
}

var Order = {
    listOrder: [],      //Список всех заказов
    listOrderNew: [],   //Список текущих заказов
    listOrderEnd: [],   //Список завершенных заказов

    //Вывод всех заказов
    getOrders: function () {
        $.ajax({
            url: '/api/order/GetOrderUser',
            type: 'GET',
            dataType: 'html',
            success: function (data) {
                Order.listOrder = JSON.parse(data);
                Order.listOrderNew = Order.listOrder.filter(i => !i.dateEnd);
                Order.listOrderEnd = Order.listOrder.filter(i => i.dateEnd);
                let html = "";
                if (Order.listOrder.length != 0) {
                    for (var i in Order.listOrder)
                        html += Order.viewOrder(Order.listOrder[i]);
                    $("#table-list-order").html(html);
                }
                else {
                    html += "<img src=\"image/EmptyBask.png\"/>";
                    html += "<h2>Ой, пусто!</h2>"
                    $('.empty-bask').html(html);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },

    //Вставка html кода
    viewOrder: function (data) {
        let html = "<table class=\"table table-hover\" onclick=\"Order.informOrder(" + data.order_Id + ")\">";
        html += "<tbody><tr>";
        html += "<th class=\"w-30\"><i id=\"bi-swap" + data.order_Id +"\" class=\"bi bi-chevron-down bi-css\"></i><span class=\"orange\">Заказ №" + data.order_Id + "</span></th>";
        html += "<td class=\"w-15\">" + data.date + "</td>";
        html += "<td class=\"w-15\">" + data.count + " шт.</td>";
        html += "<td class=\"w-15\"><b>" + data.price + " руб</b></td>";
        html += "<td class=\"w-25\">" + data.status + "</td></tr></tbody></table>";
        html += "<div id=\"sostav-zakaza" + data.order_Id + "\"></div>";
        return html;
    },

    //Информация об одном заказе
    informOrder: function (id) {
        let html = $("#sostav-zakaza" + id).html();
        $('#bi-swap' + id).toggleClass('bi-chevron-down bi-chevron-up');
        if (html == "") {
            html = "<table class=\"table table-sm\">";
            html += "<thead><tr>";
            html += "<td class=\"w-50\">Товар</td>";
            html += "<td>Цена</td>";
            html += "<td>Количество</td>";
            html += "<td>Сумма</td></tr></thead><tbody>";
            var o = Order.listOrder.find(i => i.order_Id == id);
            for (var i in o.sostav) {
                html += "<td class=\"orange\">" + o.sostav[i].name + " " + o.sostav[i].size + " см</td>";
                html += "<td><b>" + o.sostav[i].price + " руб</b></td>";
                html += "<td>" + o.sostav[i].count + " шт.</td>";
                html += "<td><b>" + o.sostav[i].price * o.sostav[i].count +" руб<b></td></tr>";
            }
            html += "<tr><td colspan=\"3\" align=\"right\"><b>Итого:</b></td><td><b>" + o.price + " руб</b></td></tr>";
            html += "</tbody></table>";    
            $("#sostav-zakaza" + id).html(html);
        }
        else $("#sostav-zakaza" + id).html("");
    }
}