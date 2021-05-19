$(document).ready(function () {
    loading.init();
});

var User = {}

var loading = {
    pageId: 1,  //Номер текущей страницы

    //Начальная инициализация
    init: function () {
        User = jobCoocies.readCookies(0);
        let html = "";  //Текст вставки
        let arr = User.url.split(';');
        html += "<ul class=\"navbar-nav mr-auto\"><li class=\"nav-item active\">";
        html += "<a class=\"nav-link\">" + arr[1] + "</a></li></ul>";
        html += "<div class=\"mr-sm-2 text_log\">" + User.message + "</div>";
        html += "<button class=\"btn btn-outline-info my-2 my-sm-0\" onclick=\"users.logOff()\" type=\"submit\">Выйти</button>";
        $('#login').html(html);
        Order.getOrders();
    },
    
    //Смена страницы
    swapPage: function (id) {
        $('#information-block' + loading.pageId + '').removeClass('information-block-active');
        loading.pageId = id;
        $('#information-block' + loading.pageId + '').addClass('information-block-active');
        var active = [];
        switch (id) {
            case 1: {
                active = Order.listOrder;
            } break;
            case 2: {
                active = Order.listOrderNew;
            } break;
            case 3: {
                active = Order.listOrderMy;
            } break;
        }
        let html = "";
        if (active.length != 0) {
            for (var i in active)
                html += Order.viewOrder(active[i]);
            $("#inform-order").html(html);
            $("#emptyTable").html("");
        }
        else {
            html += "<div class='empty-bask'><img src=\"image/EmptyBask.png\"/>";
            html += "<h2>Ой, пусто!</h2></div>"; 
            $("#inform-order").html("");
            $("#emptyTable").html(html);
        }   
    }
}

var Print = {

	//Печать чека
	PrintOrder: function() {
		$("#printerOrder").printThis({
			header: "<h1>Детали заказа</h1>"
		});
	}
}

var Order = {
    listOrder: [],      //Список всех заказов
    listOrderNew: [],   //Список новых заказов
    listOrderMy: [],    //Список моих заказов
    listStatus: [],     //Список статусов заказа
    orderId: 0,         //id выбранного заказа

    //Вывод всех заказов
    getOrders: function () {
        $.ajax({
            url: '/api/order',
            type: 'GET',
            dataType: 'HTML',
            success: function (data) {
                var order = JSON.parse(data);
                Order.listOrder = order.order;
                Order.listOrderNew = Order.listOrder.filter(i => i.status_FK == 1);
                Order.listOrderMy = Order.listOrder.filter(i => i.moder_FK == User.id);
                Order.listStatus = order.status;
                let html = "";
                if (order.order.length != 0) {
                    for (var i in order.order) {
                        html += Order.viewOrder(order.order[i]);
                    }
                    $("#inform-order").html(html);
                    $("#emptyTable").html("");
                }
                else {
                    html += "<div class='empty-bask'><img src=\"image/EmptyBask.png\"/>";
                    html += "<h2>Ой, пусто!</h2></div>";
                    $("#inform-order").html("");
                    $("#emptyTable").html(html);
                }
                $("#listOrder").html(Order.listOrder.length);
                $("#listOrderNew").html(Order.listOrderNew.length);
                $("#listOrderMy").html(Order.listOrderMy.length);
                
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },

    //Вставка html кода
    viewOrder: function (data) {
        let html = "";
        html += "<tr align=\"center\">";
        html += "<th>" + data.order_Id + "</th>";
        html += "<td>" + data.date + "</td>";
        html += "<td>" + data.price + " ₽</td>";
        html += "<td>" + data.pay + "</td>";
        html += "<td>" + data.address + "</td>";
        html += "<td>" + data.message + "</td>";
        html += "<td class=\"inform-statusOrder\">" + data.status + "</td>";
        html += "<td><i class=\"bi bi-gear\" onclick=\"Order.informOrder(" + data.order_Id + ")\"></i></td>";
        html += "</tr>";
        return html;
    },

    //Информация об одном заказе
    informOrder: function (id) {
        Order.orderId = id;
        var j = Order.listOrder.findIndex(item => item.order_Id == id);   //Ищем элемент
        let html = "<h6>Номер заказа №" + Order.listOrder[j].order_Id + "</h6>";
        html += "<h6>Дата заказа: " + Order.listOrder[j].date + "</h6>";
        html += "<h6>Способ оплаты: " + Order.listOrder[j].pay + "</h6>";
        html += "<h6>Адрес доставки: " + Order.listOrder[j].address + "</h6>";
        html += "<h6>Комментарий: " + Order.listOrder[j].message + "</h6><br>";
        html += "<h5>Подробности заказа:</h5>";
        html += "<table class=\"table\"><tbody>";
        for (var i in Order.listOrder[j].sostav) {
            var number = Math.floor(i) + 1;
            html += "<tr><td>" + number + ".</td>";
            html += "<td>" + Order.listOrder[j].sostav[i].name + "</td>";
            html += "<td>" + Order.listOrder[j].sostav[i].size + " см</td>";
            html += "<td>" + Order.listOrder[j].sostav[i].count + " шт.</td>";
            html += "<td>" + (Order.listOrder[j].sostav[i].count * Order.listOrder[j].sostav[i].price) + " ₽</td>";
            if (Order.listOrder[j].sostav[i].message == "")
                html += "<td class=\"w-50 text-justify text-lowercase\">–</td>";
            else html += "<td class=\"w-50 text-justify text-lowercase\">" + Order.listOrder[j].sostav[i].message + "</td>";
            html += "</tr>";
        }
        html += "</tbody></table><hr>";
        html += "<h5 align=\"right\">Итого к оплате: " + Order.listOrder[j].price + " ₽</h5>";
        $("#printerOrder").html(html);
        html = "";
        for (var i in Order.listStatus) {
            if (Order.listStatus[i].statusId == Order.listOrder[j].status_FK)
                html += "<option value=\"" + Order.listStatus[i].statusId +"\" selected>" + Order.listStatus[i].name + "</option>";
            else html += "<option value=\"" + Order.listStatus[i].statusId +"\">" + Order.listStatus[i].name + "</option>";
        }
        $("#listStatuses").html(html);
        $('#viewOrderModal').modal('show');
    },

    //Редактирования заказа
    editOrder: function () {
        var address = "false";
        if (Order.listStatus[Order.listStatus.length - 1].statusId == $('#listStatuses').val())
            address = "true";
        $.ajax({
            url: '/api/order/' + Order.orderId,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                status_FK: $('#listStatuses').val(),
                moder_FK: User.id,
                address: address
            }),
            success: function (data) {
                alert("Запись изменена");
                location.reload();
            }
        });
    }
}