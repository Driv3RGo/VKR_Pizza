$(document).ready(function () {
    loading.init();
});

var loading = {

    //Начальная инициализация
    init: function () {
        var href = document.location.href;
        var lastPathSegment = href.substr(href.lastIndexOf('/') + 1);   //Получаем название html файла
        switch (lastPathSegment) {
            case "adminPanelOne.html": Report.getRaitingPizza(); break;     //Главная страница
            case "adminPanelTwo.html": Users.getUser(); break;              //Пользователи
            case "adminPanelThree.html": Report.getOrders(); break;         //Заказы
            case "adminPanelFour.html": Ingredient.getListIngredient(); break;//Ингредиенты
            case "adminPanelFive.html": PayMethod.getListPay(); break;      //Способы оплаты
            case "adminPanelSix.html": Kategori.getListKategori(); break;   //Категории
            case "adminPanelSeven.html": SizePizza.getListSize(); break;    //Размеры пицц
            case "adminPanelEight.html": Status.getListStatus(); break;     //Статусы заказов
            case "adminPanelNine.html": Report.getRaitingModer(); break;    //Отчёт по операторам
        }     
    }
}

var Graphic = {
    colors: ['rgba(216, 27, 96, 0.6)', 'rgba(3, 169, 244, 0.6)', 'rgba(255, 152, 0, 0.6)', 'rgba(29, 233, 182, 0.6)', 'rgba(156, 39, 176, 0.6)', 'rgba(84, 110, 122, 0.6)'],
    month: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],

    //Круговая диаграмма главного меню
    createPieMenu: function (labels, datasets) {
        var ctx = document.getElementById('myChart');
        var myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [datasets]
            },
            options: {
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        boxWidth: 50,
                        fontColor: 'black',
                        fontSize: 14
                    }
                },
                plugins: {
                    datalabels: {
                        display: false
                    }
                }
            }
        });
    },

    //Линейная диаграмма заказов
    createLineOrder: function (labels, datasets) {
        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                title: {
                    display: true,
                    text: 'Доход от продаж',
                    position: 'top',
                    fontSize: 16,
                    padding: 20,
                    color: 'black'
                },
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        boxWidth: 50,
                        fontColor: 'black',
                        fontSize: 14
                    }
                },
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Доход, руб.',
                            fontSize: 16
                        }
                    }],
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Дни месяца',
                            fontSize: 16
                        }
                    }]
                },    
                plugins: {
                    datalabels: {
                        display: false
                    }
                }
            }
        });
    },

    //Столбчатая диаграмма заказов
    createBarOrder: function (labels, datasets) {
        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasets,
            },
            options: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Доход от продаж',
                    position: 'top',
                    fontSize: 16,
                    padding: 20,
                    color: 'black'
                },
                plugins: {
                    datalabels: {
                        color: 'black',
                        textAlign: 'center',
                        font: {
                            fontSize: 20,
                            weight: 'bold'
                        },
                        formatter: function (value, ctx) {
                            return value + ' ₽';
                        }
                    }
                }
            }
        });
    },

    //Круговая диаграмма способов оплаты
    createPieSizePay: function (labels, datasets) {
        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [datasets]
            },
            options: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        boxWidth: 50,
                        fontColor: 'black',
                        fontSize: 14
                    }
                },
                tooltips: {
                    enabled: false
                },
                plugins: {
                    datalabels: {
                        display: true,
                        color: 'black',
                        textAlign: 'center',
                        font: {
                            size: 18,
                            lineHeight: 1.6
                        },
                        formatter: function (value, ctx) {
                            if (value != 0)
                                return value;
                            else return '';
                        }
                    }
                }
            }
        });
    }
}

var Report = {
    date1: "",      //Дата1
    date2: "",      //Дата2
    
    //Настройка даты
    settingDate: function () {
        if (this.date1 == "" && this.date2 == "") {
            var date = new Date();
            Report.date1 = date.getFullYear() + "-" + (date.getMonth() + 1) + "-01";
            var day = new Date(date.getFullYear(), (date.getMonth() + 1), 0).getDate();
            Report.date2 = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + day;
        }
        else if (this.date1 == "")
            Report.date1 = this.date2.substr(0, this.date2.length - 2) + "01"; 
        else if (this.date2 == "") {
            var arr = Report.date1.split("-");
            var day = new Date(arr[0], arr[1], 0).getDate();
            Report.date2 = this.date1.substr(0, this.date1.length - 2) + day;
        }
    },

    //Вывод рейтинга пицц
    getRaitingPizza: function () {
        Report.date1 = $("#inputdate1").val();
        Report.date2 = $("#inputdate2").val();
        if (Report.date1 > Report.date2 && Report.date1 != "" && Report.date2 != "") {
            Report.date1 = $("#inputdate2").val();
            Report.date2 = $("#inputdate1").val();
        }
        Report.settingDate();
        $.ajax({
            url: '../api/Report/RaitingPizza',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                date1: this.date1,
                date2: this.date2
            }),
            success: function (data) {
                let html = "";
                $("#datesearch").html("Рейтинг пицц с " + Report.date1 + " по " + Report.date2);
                if (data.length > 0) {
                    var labels = [];
                    var datasets = { data: [], backgroundColor: [] };
                    for (var i in data) {
                        labels.push(data[i].name);
                        datasets.data.push(data[i].count);
                        datasets.backgroundColor.push(Graphic.colors[i % Graphic.colors.length]);
                        html += "<tr>";
                        html += "<td>" + data[i].pizza_Id + "</td>";
                        html += "<td>" + data[i].name + "</td>";
                        html += "<td>" + data[i].price + " ₽</td>";
                        html += "<td>" + data[i].count + "</td></tr>";
                    }
                    $("#diagrammaInfo").html("<canvas id=\"myChart\"></canvas>");
                    $("#raitingPizzaTable").html(html);
                    Graphic.createPieMenu(labels, datasets);
                    $("#mainInformation1").css('display', 'block');
                    $("#mainInformation2").css('display', 'none');
                }
                else {
                    $("#mainInformation1").css('display', 'none');
                    $("#mainInformation2").css('display', 'block');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },

    //Вывод заказов по дате
    getOrders: function () {
        Report.date1 = $("#inputdate1").val();
        Report.date2 = $("#inputdate2").val();
        if (Report.date1 > Report.date2 && Report.date1 != "" && Report.date2 != "") {
            Report.date1 = $("#inputdate2").val();
            Report.date2 = $("#inputdate1").val();
        }
        Report.settingDate();
        $.ajax({
            url: '../api/Report/GetOrders',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                date1: this.date1,
                date2: this.date2
            }),
            success: function (data) {
                let html = "";
                $("#datesearch").html("Продажи пицц с " + Report.date1 + " по " + Report.date2);
                if (data.orders.length > 0) {
                    var labels = [];
                    var datasets = [];
                    let dateStart = Report.date1.split('-');    //Получаем начальное число отчёта
                    let dateEnd = Report.date2.split('-');      //Получаем конечное число отчёта
                    var data1 = []; //Массив данных, индекс - (номер дня, номер месяца, номер года) - зависит от ситуации
                    //Данные за 1 месяц
                    if (data.oneMonth && data.oneYear) {
                        
                        //Заполняем дни
                        for (var i = Number.parseInt(dateStart[2]); i < dateEnd[2]; i++) {
                            data1.push(0);  //Данные на день
                            labels.push(i); //Номер дня
                        }
                        for (var i in data.orders) {
                            let arr = data.orders[i].date.split('.');    //[0] - день, [1] - месяц, [2] - год
                            data1[Number.parseInt(arr[0]) - Number.parseInt(dateStart[2])] += data.orders[i].price;
                            html += Order.viewOrder(data.orders[i]);
                        }
                        var datas = {
                            label: Graphic.month[Number.parseInt(dateStart[1]) - 1],
                            data: data1,
                            fill: false,
                            pointRadius: 5,
                            pointHoverRadius: 10,
                            lineTension: 0.2,
                            borderColor: 'rgb(105, 33, 192)'
                        };
                    }
                    //Данные за 2 месяца и более
                    else {
                        if (data.oneYear) {
                            //Заполняем месяца
                            for (var i = Number.parseInt(dateStart[1]); i <= Number.parseInt(dateEnd[1]); i++) {
                                data1.push(0);  //Данные на месяц
                                labels.push(Graphic.month[i - 1]); //Название месяца
                            }
                            for (var i in data.orders) {
                                let arr = data.orders[i].date.split('.');    //[0] - день, [1] - месяц, [2] - год
                                data1[Number.parseInt(arr[1]) - Number.parseInt(dateStart[1])] += data.orders[i].price;
                                html += Order.viewOrder(data.orders[i]);
                            }
                        }
                        else {
                            //Заполняем года
                            for (var i = Number.parseInt(dateStart[0]); i <= Number.parseInt(dateEnd[0]); i++) {
                                data1.push(0);  //Данные на год
                                labels.push(i); //Номер года
                            }
                            for (var i in data.orders) {
                                let arr = data.orders[i].date.split('.');    //[0] - день, [1] - месяц, [2] - год
                                data1[Number.parseInt(arr[2]) - Number.parseInt(dateStart[0])] += data.orders[i].price;
                                html += Order.viewOrder(data.orders[i]);
                            }
                        }
                        var datas = {
                            label: 'Доход, руб.',
                            data: data1,
                            backgroundColor: Graphic.colors[2]
                        };
                    }
                    datasets.push(datas);
                    $("#OrderTable").html(html);
                    $("#diagrammaInfo").html("<canvas id=\"myChart\"></canvas>");
                    if (data.oneMonth && data.oneYear)
                        Graphic.createLineOrder(labels, datasets);
                    else Graphic.createBarOrder(labels, datasets);
                    $("#mainInformation1").css('display', 'block');
                    $("#mainInformation2").css('display', 'none');
                }
                else {
                    $("#mainInformation1").css('display', 'none');
                    $("#mainInformation2").css('display', 'block');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },

    //Поиск пользователей по фильтру
    searchUsers: function () {
        var index = $('input[name=radiob]:checked', '#filter-Search').val();    //Получаем выбранный фильтр
        if(index != 4)
            var search = new RegExp($("#searchingUser").val(), "i");
        else var search = $("#searchingUser").val();
        let html = "";
        for (var i in Users.listUser) {
            switch (index) {
                case "1": {
                    if (Users.listUser[i].fio.match(search))
                        html += Users.viewUsers(Users.listUser[i], i);
                } break;
                case "2": {
                    if (Users.listUser[i].email.match(search))
                        html += Users.viewUsers(Users.listUser[i], i);
                } break;
                case "3": {
                    if (Users.listUser[i].phonenumber.match(search))
                        html += Users.viewUsers(Users.listUser[i], i);
                } break;
                case "4": {
                    if (Users.listUser[i].bonus >= search)
                        html += Users.viewUsers(Users.listUser[i], i);
                } break;
                case "5": {
                    if (Users.listUser[i].role.match(search))
                        html += Users.viewUsers(Users.listUser[i], i);
                } break;
            }
        }
        $("#information-user").html(html);
    },

    //Работа операторов
    getRaitingModer: function () {
        Report.date1 = $("#inputdate1").val();
        Report.date2 = $("#inputdate2").val();
        if (Report.date1 > Report.date2 && Report.date1 != "" && Report.date2 != "") {
            Report.date1 = $("#inputdate2").val();
            Report.date2 = $("#inputdate1").val();
        }
        Report.settingDate();
        $.ajax({
            url: '../api/Report/RaitingModer',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                date1: this.date1,
                date2: this.date2
            }),
            success: function (data) {
                let html = "";
                $("#datesearch").html("Производительность операторов с " + Report.date1 + " по " + Report.date2);
                if (data.length > 0) {
                    var labels = [];
                    var datasets = { data: [], backgroundColor: [] };
                    for (var i in data) {
                        labels.push(data[i].fio);
                        datasets.data.push(data[i].count);
                        datasets.backgroundColor.push(Graphic.colors[i % Graphic.colors.length]);
                        html += "<tr>";
                        html += "<td>" + data[i].fio + "</td>";
                        html += "<td>" + data[i].count + "</td>";
                        html += "<td>" + data[i].payday + " ₽</td></tr>";
                    }
                    $("#diagrammaInfo").html("<canvas id=\"myChart\"></canvas>");
                    $("#raitingModerTable").html(html);
                    Graphic.createPieMenu(labels, datasets);
                    $("#mainInformation1").css('display', 'block');
                    $("#mainInformation2").css('display', 'none');
                }
                else {
                    $("#mainInformation1").css('display', 'none');
                    $("#mainInformation2").css('display', 'block');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}

var Users = {
    listUser: [],   //Список пользователей

    //Вывод списка пользователей
    getUser: function () {
        $.ajax({
            url: '../api/Report/UserList',
            type: 'POST',
            success: function (data) {
                Users.listUser = data;
                let html = "";
                for (var i in data) {
                    html += Users.viewUsers(data[i], i);
                }
                $("#information-user").html(html);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },

    //Вставка html кода с пользователями
    viewUsers: function (data, i) {
        let html = "";
        html += "<tr align=\"center\">";
        html += "<td>" + i + "</td>";
        html += "<td>" + data.fio + "</td>";
        html += "<td>" + data.email + "</td>";
        html += "<td>+7 " + data.phonenumber + "</td>";
        html += "<td><input id=\"bonusinput" + i + "\" class=\"form-control form-control-sm\" type=\"number\" step=\"10\" value=" + data.bonus + "></td>";
        html += "<td><select id=\"selectedRoles" + i + "\" class=\"form-control form-control-sm\">";
        let arr = data.listrole.split(',');
        for (var j in arr) {
            if (arr[j] == data.role)
                html += "<option selected value=\"" + arr[j] + "\">" + arr[j] + "</option>";
            else html += "<option value=\"" + arr[j] + "\">" + arr[j] + "</option>";
        }
        html += "</select></td><td class=\"setting-user\">";
        html += "<i class=\"bi bi-gear\" onclick=\"Users.updateUser(" + i + ")\"></i>";
        html += "<i class=\"bi bi-x-circle\" onclick=\"Users.deleteUser(" + i + ")\"></i></td></tr>";
        return html;
    },

    //Редактирования пользователя
    updateUser: function (id) {
        var bonus = $('#bonusinput' + id + '').val();
        var role = $('#selectedRoles' + id + '').val();
        $.ajax({
            url: '../api/Report/UpdateUser',
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                email: Users.listUser[id].email,
                bonus: bonus,
                role: role,
            }),
            success: function (data) {
                alert("Запись изменена");
            }
        });
    },

    //Удаление пользователя
    deleteUser: function (id) {
        $.ajax({                        
            url: '../api/Report/DeleteUser',  
            type: 'DELETE',             
            contentType: 'application/json',
            data: JSON.stringify({
                email: Users.listUser[id].email
            }),     
            success: function (data) {  
                alert("Запись удалена");
                location.reload();
            },
        });
    }
}

var Order = {
    //Вставка html кода с заказом
    viewOrder: function (data) {
        let html = "";
        html += "<tr align=\"center\">";
        html += "<td>" + data.order_Id +"</td>";
        html += "<td>" + data.date + "</td>";
        html += "<td>" + data.price + " ₽</td>";
        html += "<td>" + data.pay + "</td>";
        html += "</tr>";
        return html;
    },
}

var Ingredient = {
    ingList: [],    //Список картинок

    //Вывод всех ингредиентов
    getListIngredient: function () {
        $.ajax({
            url: '../api/kategori',
            type: 'GET',
            dataType: 'HTML',
            success: function (data) {
                let html = "";
                Kategori.kategoriList = JSON.parse(data);
                for (var i in Kategori.kategoriList) {
                    if (i == 0)
                        html += "<option selected value=\"" + Kategori.kategoriList[i].kategoriId + "\">" + Kategori.kategoriList[i].name + "</option>";
                    else html += "<option value=\"" + Kategori.kategoriList[i].kategoriId + "\">" + Kategori.kategoriList[i].name + "</option>";
                }
                $("#IngredientKategories").html(html);
            }
        });
        $.ajax({
            url: '../api/ingredient',
            type: 'GET',
            dataType: 'HTML',
            success: function (data) {
                let html = "";
                var ing = JSON.parse(data);
                for (var i in ing) {
                    if (i != 0) {
                        Ingredient.ingList.push(ing[i].picture);
                        html += "<tr>";
                        html += "<td><input id=\"nameIng" + ing[i].ingredientID + "\" class=\"form-control form-control-sm\" type=\"text\" value='" + ing[i].name + "'></td>";
                        html += "<td><input id=\"priceIng" + ing[i].ingredientID + "\" class=\"form-control form-control-sm\" type=\"number\" step='1' min='0' value='" + ing[i].price + "'></td>";
                        html += "<td><input id=\"massaIng" + ing[i].ingredientID + "\" class=\"form-control form-control-sm\" type=\"number\" step='1' min='0' value='" + ing[i].massa + "'></td>";
                        html += "<td><div class=\"d-flex\"><img class=\"image-table\" src=\"../image/ing/" + ing[i].picture + "\"/><input id=\"picture1Ing" + ing[i].ingredientID + "\" class=\"form-control-file form-control-sm\" type=\"file\"></div></td>";
                        html += "<td><div class=\"d-flex\"><img class=\"image-table\" src=\"../image/ing_create/" + ing[i].picture + "\"/><input id=\"picture2Ing" + ing[i].ingredientID + "\" class=\"form-control-file form-control-sm\" type=\"file\"></div></td>";
                        html += "<td><select id=\"selectedKategories" + ing[i].ingredientID + "\" class=\"form-control form-control-sm\">";
                        for (var j in Kategori.kategoriList) {
                            if (Kategori.kategoriList[j].kategoriId == ing[i].kategori_FK)
                                html += "<option selected value=\"" + Kategori.kategoriList[j].kategoriId + "\">" + Kategori.kategoriList[j].name + "</option>";
                            else html += "<option value=\"" + Kategori.kategoriList[j].kategoriId + "\">" + Kategori.kategoriList[j].name + "</option>";
                        }
                        html += "</select></td><td align=\"center\">";
                        if (ing[i].availability)
                            html += "<input id=\"selectedNalichie" + ing[i].ingredientID + "\" type=\"checkbox\" class=\"form-check-input-sm\" checked>";
                        else html += "<input id=\"selectedNalichie" + ing[i].ingredientID + "\" type=\"checkbox\" class=\"form-check-input-sm\">";
                        html += "</td><td class=\"setting-user\"><i class=\"bi bi-gear\" onclick=\"Ingredient.updateIngredient(" + ing[i].ingredientID + ")\"></i>";
                        html += "<i class=\"bi bi-x-circle\" onclick=\"Ingredient.deleteIngredient(" + ing[i].ingredientID + ")\"></i></td></tr>";
                    }
                    $("#information-kategori").html(html);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },

    //Добавить новый ингредиент
    addIngredient: function () {
        var flag1 = true;   //Добавление картинки
        var flag2 = true;   //Добавление ингредиента
        var name = $('#IngredientName').val();
        var price = $('#IngredientPrice').val();
        var massa = $('#IngredientMassa').val();
        var kategori = $('#IngredientKategories').val();
        var image = $('#IngredientImg1').val().replace(/.*[\/\\]/, '').toLowerCase();
        if (Ingredient.ingList.indexOf(image) != -1) {
            flag1 = confirm("Изображения с таким названием уже существуют, заменить их?");
            if (!flag1)
                flag2 = confirm("Продолжить добавление нового ингредиента (изображения будут использованы уже существующие)?");
        }
        var formData = new FormData();
        formData.append('file1', $("#IngredientImg1")[0].files[0]);
        formData.append('file2', $("#IngredientImg2")[0].files[0]);
        if (flag2) {
            $.ajax({
                url: '../api/ingredient',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    name: name,
                    price: price,
                    massa: massa,
                    kategori_FK: kategori,
                    picture: image,
                    availability: true
                }),
                success: function (data) {
                    if (flag1)
                        Ingredient.uploadImage(formData, "Новый ингредиент успешно добавлен");
                    else {
                        alert("Новый ингредиент успешно добавлен");
                        location.reload();
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
        }
        console.log();
    },

    //Редактирования ингредиента
    updateIngredient: function (id) {
        var name = $('#nameIng' + id + '').val();
        var price = $('#priceIng' + id + '').val();
        var massa = $('#massaIng' + id + '').val();
        var kategori = $('#selectedKategories' + id + '').val();
        var image1 = $('#picture1Ing' + id + '').val();
        var image2 = $('#picture2Ing' + id + '').val();
        var availability = $('#selectedNalichie' + id + '').prop('checked');
        var formData = new FormData();
        formData.append('file1', $('#picture1Ing' + id + '')[0].files[0]);
        formData.append('file2', $('#picture2Ing' + id + '')[0].files[0]);
        $.ajax({
            url: '../api/ingredient/' + id,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                name: name,
                price: price,
                massa: massa,
                kategori_FK: kategori,
                availability: availability
            }),
            success: function (data) {
                if (image1 != "" || image2 != "") {
                    formData.append('nameFile', data);
                    Ingredient.uploadImage(formData, "Запись изменена");
                }
                else alert("Запись изменена");
            }
        });
    },

    //Загрузка картинки на сервер
    uploadImage: function (formData, msg) {
        $.ajax({
            url: '../api/ImageUpload/ingredientImg',
            type: 'POST',
            contentType: false,
            processData: false,
            data: formData,
            success: function (data) {
                alert(msg);
                location.reload();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },

    //Удаление ингредиента
    deleteIngredient: function (id) {
        $.ajax({
            url: '../api/ingredient/' + id,
            type: 'DELETE',
            success: function (data) {
                alert("Запись удалена");
                location.reload();
            },
        });
    }
}

var PayMethod = {
    //Вывод способов оплаты
    getListPay: function () {
        Report.date1 = $("#inputdate1").val();
        Report.date2 = $("#inputdate2").val();
        if (Report.date1 > Report.date2 && Report.date1 != "" && Report.date2 != "") {
            Report.date1 = $("#inputdate2").val();
            Report.date2 = $("#inputdate1").val();
        }
        Report.settingDate();
        $.ajax({
            url: '../api/Report/RaitingPay',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                date1: Report.date1,
                date2: Report.date2
            }),
            success: function (data) {
                let html = "";
                var labels = [];
                var datasets = { data: [], backgroundColor: [], borderWidth: 2, borderColor: 'white' };
                var flag = false;
                for (var i in data) {
                    labels.push(data[i].name);
                    datasets.data.push(data[i].count);
                    datasets.backgroundColor.push(Graphic.colors[i % Graphic.colors.length]);
                    html += PayMethod.viewPayMethod(data[i]);
                    if (data[i].count > 0)
                        flag = true;
                }
                $("#raitingPayTable").html(html);
                if (!flag) {
                    $("#diagrammaInfo").css('display', 'none');
                }
                else {
                    $("#diagrammaInfo").css('display', 'block');
                    $("#diagrammaInfo").html("<canvas id=\"myChart\"></canvas>");
                    Graphic.createPieSizePay(labels, datasets);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },

    //Вставка html кода со способами оплаты
    viewPayMethod: function (data) {
        let html = "<tr>";
        html += "<td class=\"w-50\">";
        html += "<input id=\"namePay" + data.pay_Id + "\" class=\"form-control form-control-sm\" type=\"text\" value='" + data.name + "'></td>";
        html += "<td class=\"setting-user\">";
        html += "<i class=\"bi bi-gear\" onclick=\"PayMethod.updatePay(" + data.pay_Id + ")\"></i>";
        html += "<i class=\"bi bi-x-circle\" onclick=\"PayMethod.deletePay(" + data.pay_Id + ")\"></i></td></tr>";
        return html;
    },

    //Добавить новый способ оплаты
    addPay: function () {
        var name = $('#PayName').val();
        $.ajax({
            url: '../api/PayMetod',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({name: name}),
            success: function (data) {
                alert("Новый способ оплаты успешно добавлен");
                location.reload();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },

    //Редактирования способа оплаты
    updatePay: function (id) {
        var name = $('#namePay' + id + '').val();
        $.ajax({
            url: '../api/PayMetod/' + id,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                name: name
            }),
            success: function (data) {
                alert("Запись изменена");
            }
        });
    },

    //Удаление способа оплаты
    deletePay: function (id) {
        $.ajax({
            url: '../api/PayMetod/' + id,
            type: 'DELETE',
            success: function (data) {
                alert("Запись удалена");
                location.reload();
            },
        });
    }
}

var SizePizza = {
    //Вывод размеров пиццы
    getListSize: function () {
        Report.date1 = $("#inputdate1").val();
        Report.date2 = $("#inputdate2").val();
        if (Report.date1 > Report.date2 && Report.date1 != "" && Report.date2 != "") {
            Report.date1 = $("#inputdate2").val();
            Report.date2 = $("#inputdate1").val();
        }
        Report.settingDate();
        $.ajax({
            url: '../api/Report/RaitingSize',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                date1: Report.date1,
                date2: Report.date2
            }),
            success: function (data) {
                let html = "";
                var labels = [];
                var datasets = { data: [], backgroundColor: [], borderWidth: 2, borderColor: 'white' };
                var flag = false;
                for (var i in data) {
                    labels.push(data[i].name);
                    datasets.data.push(data[i].count);
                    datasets.backgroundColor.push(Graphic.colors[i % Graphic.colors.length]);
                    html += SizePizza.viewSize(data[i]);
                    if (data[i].count > 0)
                        flag = true;
                }
                $("#raitingSizeTable").html(html);
                if (!flag) {
                    $("#diagrammaInfo").css('display', 'none');
                }
                else {
                    $("#diagrammaInfo").css('display', 'block');
                    $("#diagrammaInfo").html("<canvas id=\"myChart\"></canvas>");
                    Graphic.createPieSizePay(labels, datasets);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },

    //Вставка html кода со способами оплаты
    viewSize: function (data) {
        let html = "<tr>";
        html += "<td><input id=\"nameSize" + data.size_Id + "\" class=\"form-control form-control-sm\" type=\"text\" value='"+ data.name +"'></td>";
        html += "<td class=\"width-number-100\">";
        html += "<input id=\"sSize" + data.size_Id + "\" class=\"form-control form-control-sm\" min=\"1\" type=\"number\" step=\"10\" value=" + data.size + "></td>";
        html += "<td class=\"width-number-100\">";
        html += "<input id=\"kSize" + data.size_Id + "\" class=\"form-control form-control-sm\" min=\"0\" type=\"number\" step=\"0.1\" value=" + data.k + "></td>";
        html += "<td class=\"setting-user\">";
        html += "<i class=\"bi bi-gear\" onclick=\"SizePizza.updateSize(" + data.size_Id + ")\"></i>";
        html += "<i class=\"bi bi-x-circle\" onclick=\"SizePizza.deleteSize(" + data.size_Id + ")\"></i></td></tr>";
        return html;
    },

    //Добавить новый размер пиццы
    addSize: function () {
        var name = $('#SizeName').val();
        var size = $('#Sizes').val();
        var k = $('#Sizek').val();
        $.ajax({
            url: '../api/SizePizza',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                name: name,
                size: size,
                k: k
            }),
            success: function (data) {
                alert("Новый размер пиццы успешно добавлен");
                location.reload();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },

    //Редактирования размера пиццы
    updateSize: function (id) {
        var name = $('#nameSize' + id + '').val();
        var size = $('#sSize' + id + '').val();
        var k = $('#kSize' + id + '').val();
        $.ajax({
            url: '../api/SizePizza/' + id,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                name: name,
                size: size,
                k: k
            }),
            success: function (data) {
                alert("Запись изменена");
            }
        });
    },

    //Удаление размера пиццы
    deleteSize: function (id) {
        $.ajax({
            url: '../api/SizePizza/' + id,
            type: 'DELETE',
            success: function (data) {
                alert("Запись удалена");
                location.reload();
            },
        });
    }
}

var Kategori = {
    kategoriList: [],   //Список категорий

    //Вывод всех категорий
    getListKategori: function () {
        $.ajax({
            url: '../api/kategori',
            type: 'GET',
            dataType: 'HTML',
            success: function (data) {
                let html = "";
                var kat = JSON.parse(data);
                for (var i in kat) {
                    Kategori.kategoriList.push(kat[i].picture);
                    html += "<tr><td class=\"w-25\">";
                    html += "<input id=\"nameKategori" + kat[i].kategoriId + "\" class=\"form-control form-control-sm\" type=\"text\" value='" + kat[i].name + "'></td>";
                    html += "<td class=\"w-25\">";
                    html += "<div class=\"d-flex\"><img class=\"image-table\" src=\"../image/kategori/" + kat[i].picture +"\"/><input id=\"pictureKategori" + kat[i].kategoriId + "\" class=\"form-control-file form-control-sm\" type=\"file\"></div></td>";
                    html += "<td class=\"setting-user w-50\">";
                    html += "<i class=\"bi bi-gear\" onclick=\"Kategori.updateKategori(" + kat[i].kategoriId + ")\"></i>";
                    html += "<i class=\"bi bi-x-circle\" onclick=\"Kategori.deleteKategori(" + kat[i].kategoriId + ")\"></i></td></tr>";
                }
                $("#information-kategori").html(html);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },

    //Добавить новую категорию
    addKategori: function () {
        var flag1 = true;   //Добавление картинки
        var flag2 = true;   //Добавление ингредиента
        var name = $('#KategoriName').val();
        var image = $('#KategoriImg').val().replace(/.*[\/\\]/, '').toLowerCase();
        if (Kategori.kategoriList.indexOf(image) != -1) {
            flag1 = confirm("Изображение с таким названием уже существует, заменить его?");
            if (!flag1)
                flag2 = confirm("Продолжить добавление новой категории (изображение будет использовано уже существующие)?");
        }
        var formData = new FormData();
        formData.append('file1', $("#KategoriImg")[0].files[0]);
        if (flag2) {
            $.ajax({
                url: '../api/kategori',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    name: name,
                    picture: image
                }),
                success: function (data) {
                    if (flag1)
                        Kategori.uploadImage(formData, "Новая категория успешно добавлена");
                    else {
                        alert("Новая категория успешно добавлена");
                        location.reload();
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
        }
    },

    //Редактирования категории
    updateKategori: function (id) {
        var name = $('#nameKategori' + id + '').val();
        var image = $('#pictureKategori' + id + '').val();
        var formData = new FormData();
        formData.append('file1', $('#pictureKategori' + id + '')[0].files[0]);
        $.ajax({
            url: '../api/kategori/' + id,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                name: name
            }),
            success: function (data) {
                if (image != "") {
                    formData.append('nameFile', data);
                    Kategori.uploadImage(formData, "Запись изменена");
                }
                else alert("Запись изменена");
            }
        });
    },

    //Загрузка картинки на сервер
    uploadImage: function (formData, msg) {
        $.ajax({
            url: '../api/ImageUpload/kategoriImg',
            type: 'POST',
            contentType: false,
            processData: false,
            data: formData,
            success: function (data) {
                alert(msg);
                location.reload();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },

    //Удаление категории
    deleteKategori: function (id) {
        $.ajax({
            url: '../api/kategori/' + id,
            type: 'DELETE',
            success: function (data) {
                alert("Запись удалена");
                location.reload();
            },
        });
    }
}

var Status = {
    //Вывод всех статусов
    getListStatus: function () {
        $.ajax({
            url: '../api/status',
            type: 'GET',
            dataType: 'HTML',
            success: function (data) {
                let html = "";
                var status = JSON.parse(data)
                for (var i in status) {
                    html += "<tr><td class=\"w-25\">";
                    html += "<input id=\"nameStatus" + status[i].statusId + "\" class=\"form-control form-control-sm\" type=\"text\" value='" + status[i].name + "'></td>";
                    html += "<td class=\"setting-user w-50\">";
                    html += "<i class=\"bi bi-gear\" onclick=\"Status.updateStatus(" + status[i].statusId + ")\"></i>";
                    html += "<i class=\"bi bi-x-circle\" onclick=\"Status.deleteStatus(" + status[i].statusId + ")\"></i></td></tr>";
                }
                $("#information-status").html(html);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },

    //Добавить новый статус
    addStatus: function () {
        var name = $('#StatusName').val();
        $.ajax({
            url: '../api/status',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ name: name }),
            success: function (data) {
                alert("Новый статус успешно добавлен");
                location.reload();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },

    //Редактирования статуса
    updateStatus: function (id) {
        var name = $('#nameStatus' + id + '').val();
        $.ajax({
            url: '../api/status/' + id,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ name: name }),
            success: function (data) {
                alert("Запись изменена");
            }
        });
    },

    //Удаление статуса
    deleteStatus: function (id) {
        $.ajax({
            url: '../api/status/' + id,
            type: 'DELETE',
            success: function (data) {
                alert("Запись удалена");
                location.reload();
            },
        });
    }
}