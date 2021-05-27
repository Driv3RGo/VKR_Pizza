$(document).ready(function () {     //Выполняется при загрузки страницы  
    if (localStorage.getItem('ProductId'))
        jobCoocies.writeCookies(null, 2);
    localStorage.clear();
    user.getCurrentUser();          //Проверка текущей сессии  
});

var user = {
    data_user: {},

    //Проверка на авторизацию
    getCurrentUser: function () {
        $.ajax({                                    //Выполняет асинхронный HTTP (Ajax) запрос
            url: 'api/Account/isAuthenticated',     //URL адрес, на который будет отправлен Ajax запрос
            type: 'POST',                           //Определяет тип запроса
            contentType: 'application/json',        //При отправке Ajax запроса, данные передаются в том виде, в котором указаны в данном параметре
            success: function (data) {              //Функция, которая будет вызвана в случае успешного завершения запроса, data - данные, которые прислал сервер  
                if (data.id != "null") {
                    user.data_user.id = data.id;
                    user.data_user.fio = data.fio;
                    user.data_user.email = data.email;
                    user.data_user.phone = data.phone;
                    user.data_user.bonus = data.bonus;
                    user.data_user.role = data.role;
                    user.data_user.url = data.url;
                    user.data_user.message = data.message;
                    jobCoocies.writeCookies(user.data_user, 0);
                }
                let html = "";  //Текст вставки
                if (data.url != "null") {
                    let arr = data.url.split(';');
                    html += "<ul class=\"navbar-nav mr-auto\"><li class=\"nav-item\">";
                    html += "<a class=\"nav-link\" href='" + arr[0] + "'>" + arr[1] + "</a></li></ul>";
                }
                html += "<div class=\"mr-sm-2 text_log\">" + data.message + "</div>";
                if (data.role == "null") {
                    html += "<a href=\"login.html\"><button class=\"btn btn-outline-info my-2 my-sm-0\" type=\"submit\">Войти</button></a>";
                }
                else {
                    html += "<button class=\"btn btn-outline-info my-2 my-sm-0\" onclick=\"users.logOff()\" type=\"submit\">Выйти</button>";
                }
                $('#login').html(html);     //Добавление строк в html
                var pizza = jobCoocies.readCookies(1);
                if (pizza) {
                    for (var i in pizza)
                        basket.items += pizza[i].pCount;
                    $('#basketitems').html("| <span class=\"badge badge-light\">" + basket.items + "</span>");   //Изменение количества товара в корзине
                }                   
                product.getSizePizzas();
                product.getProducts();
            },
            error: function (xhr, ajaxOptions, thrownError) {   //Функция, исполняемая в случае неудачного запроса
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
};

var product = {
    sizePizza: [],      //Размеры пиццы
    almostBask: {},     //Собирается пицца для добавления в корзину с выбранными параметрами

    //Передать id для редактирования
    localProduct: function (id) {
        var pizza = {};
        $.ajax({            
            url: '/api/product/' + id,  
            type: 'GET',                
            dataType: 'HTML',           
            success: function (data) {  
                let product = JSON.parse(data);
                localStorage.setItem('ProductId', JSON.stringify({id: id, name: product.name}));
                pizza.sizeId = 1;
                pizza.price = product.price;
                pizza.massa = 0;
                pizza.ing = [];
                for (var i in product.compositions) {
                    var informIng = {};
                    informIng.id = product.compositions[i].ingredient_FK;       //id ингредиента
                    informIng.name = product.compositions[i].ingredient.name;   //Наименование
                    informIng.icount = product.compositions[i].count;           //Количество данного вида ингредиента
                    informIng.ikat = product.compositions[i].ingredient.kategori_FK; //id категории
                    informIng.ipicture = product.compositions[i].ingredient.picture; //картинка
                    informIng.imassa = product.compositions[i].ingredient.massa;
                    informIng.iprice = product.compositions[i].ingredient.price;
                    pizza.massa += product.compositions[i].count * product.compositions[i].ingredient.massa;    //Считаем массу
                    pizza.ing.push(informIng);
                };
                jobCoocies.writeCookies(pizza, 2);
                $(location).attr('href', "designer.html");
            }
        });
    },

    //Вывод всех продуктов
    getProducts: function () {
        $.ajax({                    //Выполняет асинхронный HTTP (Ajax) запрос
            url: '/api/product',    //URL адрес, на который будет отправлен Ajax запрос
            type: 'GET',            //Определяет тип запроса
            dataType: 'HTML',       //Тип данных, ожидаемых от сервера
            success: function (data) {  //Функция, которая будет вызвана в случае успешного завершения запроса, data - данные, которые прислал сервер
                let products = JSON.parse(data); //Разбирает строку JSON
                let html = "";  //Текст вставки
                var flag = 0;   //Вставка запятой, после каждого ингредиента, перед первым ингредиентом в списке, запятая не ставится
                if (products) { //Проверка что данные есть
                    for (var i in products) {
                        flag = 0;
                        let html1 = "<div class=\"card\" onclick=\"product.informPizza(" + products[i].productID + ")\">";
                        html1 += "<img class=\"card-img-top\" src=image/product/" + products[i].picture + ">";
                        html1 += "<div class=\"card-body\">";
                        html1 += "<h2 class=\"card-title\">" + products[i].name + "</h2>";
                        html1 += "<hr/><p class=\"card-text\">";
                        for (var j in products[i].compositions) {                   //Состав пиццы
                            if (!products[i].compositions[j].ingredient.availability && user.data_user.role != "admin") {
                                flag = 2;
                                break;                               
                            }
                            if (flag == 0) {
                                html1 += products[i].compositions[j].ingredient.name;
                                flag = 1;
                            }
                            else html1 += ", " + products[i].compositions[j].ingredient.name;
                        }
                        if (flag == 2)
                            continue;
                        html1 += "</p><hr/><div class=\"card_price_b\">";
                        html1 += "<div class=\"card_child\">от " + products[i].price + " ₽</div>";
                        html1 += "<button type=\"button\" class=\"btn card_child\" data-toggle=\"modal\" data-target=\".bd-example-modal-xl\">Купить ></button>";
                        html1 += "</div>"
                        if (user.data_user.role == "admin") {  //Если админ, то кнопки "редактировать" и "удалить"
                            html1 += "<button type=\"button\" class=\"btn btn-warning\" onclick=\"product.localProduct(" + products[i].productID + ")\" data-toggle=\"modal\" data-target=\"#productModal\">редактировать</button>";
                            html1 += "<button type=\"button\" class=\"btn btn-danger\" onclick=\"product.deleteProduct(" + products[i].productID + ")\">удалить</button>";
                        }
                        html1 += "</div></div>";
                        html += html1;
                    }
                }
                $('#productsDiv').html(html);   //Добавление строк в html
            },
            error: function (xhr, ajaxOptions, thrownError) {   //Функция, исполняемая в случае неудачного запроса
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },

    //Вывести информацию о выбранной пицце
    informPizza: function (id) {
        $.ajax({                        //Выполняет асинхронный HTTP (Ajax) запрос
            url: '/api/product/' + id,  //URL адрес, на который будет отправлен Ajax запрос
            type: 'GET',                //Определяет тип запроса
            dataType: 'HTML',           //Тип данных, ожидаемых от сервера
            success: function (data) {  //Функция, которая будет вызвана в случае успешного завершения запроса, data - данные, которые прислал сервер
                let products = JSON.parse(data);     //Разбирает строку JSON
                let html = "";                      //Текст вставки
                html += "<h2>" + products.name + "</h2>";
                html += "<span id=\"razmer\"></span><br/>";
                html += "<div id=\"PizzaSizes\" class=\"btn-group btn-group-toggle\" data-toggle=\"buttons\"></div>";
                html += "<h5>Состав</h5><p>"
                for (var i in products.compositions) {                   //Состав пиццы
                    if (i == 0) {
                        html += products.compositions[i].ingredient.name;
                    }
                    else html += ", " + products.compositions[i].ingredient.name;
                }
                html += "";
                html += "</p><br />";
                html += "<button id=\"adddBasket\" type=\"button\" class=\"btn pppp\" onclick=\"basket.addBasket()\">Добавить в корзину за " + products.price + " ₽</button>"
                $("#size_imgPizza").css('width', '');            
                $("#size_imgPizza").css('margin-left', '');
                $('#size_imgPizza').attr('src', "image/product/" + products.picture);
                $('#getOnePizza').html(html); 
                let button = "";    //Текст вставки
                var w = 80;         //Начальный размер картинки
                var mt = 10;        //Отступ сверху
                for (var i = 0; i < product.sizePizza.length; i++) {
                    if (i == 0) {
                        button += "<label class=\"btn inform-btn active\">";
                        $('#razmer').html(product.sizePizza[i].size + " см");
                        product.almostBask.sId = product.sizePizza[i].sizeId;
                        product.almostBask.sName = product.sizePizza[i].name;
                        product.almostBask.sSize = product.sizePizza[i].size;
                        product.almostBask.sPrice = products.price;
                        product.almostBask.pId = products.productID;
                        product.almostBask.pName = products.name;
                        product.almostBask.pImage = products.picture; 
                        product.almostBask.pCount = 1; 
                    }
                    else button += "<label class=\"btn inform-btn\">";
                    button += "<input type=\"radio\" autocomplete=\"off\" checked onclick=\"product.sizeImg('" + w + "%', '" + mt + "%', " + product.sizePizza[i].sizeId + ", " + products.price + ")\" > " + product.sizePizza[i].name + "</label>";
                    w += 15;
                    mt -= 7
                }
                $('#PizzaSizes').html(button); 
                $('#Inform_Pizza').modal('show');   //Открыть окно информации
            },
            error: function (xhr, ajaxOptions, thrownError) {   //Функция, исполняемая в случае неудачного запроса
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },

    //Изменение размера картинки в модальном окне
    sizeImg: function (w, ml, sizeId, price) {
        let i = product.sizePizza.find(j => j.sizeId == sizeId);    //Ищем нужный размер
        $("#size_imgPizza").css('width', w);            //Изменяем размер картинки
        $("#size_imgPizza").css('margin-left', ml);     //Изменяем отступ картинки
        $('#razmer').html(i.size + " см");              //Изменяем размер          
        $('#adddBasket').html("Добавить в корзину за " + Math.floor(price * i.k) + " ₽");  //Изменяем цену
        product.almostBask.sPrice = Math.floor(price * i.k);
        product.almostBask.sId = sizeId;
        product.almostBask.sName = i.name;
        product.almostBask.sSize = i.size;
    },

    //Информация о размерах пиццы
    getSizePizzas: function () {
        $.ajax({                    //Выполняет асинхронный HTTP (Ajax) запрос
            url: '/api/sizepizza',  //URL адрес, на который будет отправлен Ajax запрос
            type: 'GET',            //Определяет тип запроса
            dataType: 'HTML',       //Тип данных, ожидаемых от сервера
            success: function (data) {  //Функция, которая будет вызвана в случае успешного завершения запроса, data - данные, которые прислал сервер
                product.sizePizza = JSON.parse(data); //Разбирает строку JSON
            },
            error: function (xhr, ajaxOptions, thrownError) {   //Функция, исполняемая в случае неудачного запроса
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },

    //Удалить продукт
    deleteProduct: function (id) {
        $.ajax({                        //Выполняет асинхронный HTTP (Ajax) запрос
            url: '/api/product/' + id,  //URL адрес, на который будет отправлен Ajax запрос
            type: 'DELETE',             //Определяет тип запроса
            dataType: 'HTML',           //Тип данных, ожидаемых от сервера
            success: function (data) {  //Функция, которая будет вызвана в случае успешного завершения запроса, data - данные, которые прислал сервер
                location.reload();
                alert("Запись удалена");
            },
        });
    },
}

var basket = {
    items: 0,       //Кол-во пицц в корзине

    //Добавление в корзину
    addBasket: function () {
        var data = jobCoocies.readCookies(1);    //Считываем данные из куков
        if (data == null) {                      //Проверяем наличие данных
            var element = [];
            element.push(product.almostBask);
            jobCoocies.writeCookies(element, 1);
        }
        else {
            var i = data.findIndex(item => item.pId == product.almostBask.pId && item.sId == product.almostBask.sId);
            if (i != -1)
                data[i].pCount++;
            else {
                data.push(product.almostBask);
            }
            jobCoocies.writeCookies(data, 1);
        }
        basket.items++;
        $('#basketitems').html("| <span class=\"badge badge-light\">" + basket.items + "</span>");   //Изменение количества товара в корзине
    },

    //Открыть корзину
    openBasket: function () {
        if (!user.data_user) {
            $(location).attr('href', "basket.html");
        }
        else {
            swal({
                title: "Необходимо выполнить вход",
                type: "warning",
                showCancelButton: true,
                cancelButtonText: "Отмена",
                confirmButtonColor: "rgb(255, 105, 0)",
                confirmButtonText: "Авторизоваться"
            },
            function () {
                $(location).attr('href', "login.html");
            });
        }
        
    },
};

var ingredients = {
    sostav: [],         //Выбранный состав
    sum: 0,             //Стоимость пиццы

    //Заполнение ингредиентами
    getIng: function () {
        $.ajax({                        //Выполняет асинхронный HTTP (Ajax) запрос
            url: '/api/ingredient',     //URL адрес, на который будет отправлен Ajax запрос
            type: 'GET',                //Определяет тип запроса
            dataType: 'HTML',           //Тип данных, ожидаемых от сервера
            success: function (data) {  //Функция, которая будет вызвана в случае успешного завершения запроса, data - данные, которые прислал сервер
                let ingredients = JSON.parse(data); //Разбирает строку JSON
                let sous = "";  //Вставка соусов
                let cheese = "";  //Вставка сыров
                let meat = "";  //Вставка мясо
                let fish = "";  //Вставка рыбы
                let grib = "";  //Вставка грибов
                let herb = "";  //Вставка овощей
                let species = "";  //Вставка специй
                let html = "";
                if (ingredients) {  //Проверка что данные есть
                    for (var i in ingredients) {    //Цикл по всем ингредиентам
                        html = "";
                        html += "<button id=\"" + ingredients[i].ingredientID + "\" class=\"card_btn\" onclick=\"ingredients.pushIng(" + ingredients[i].ingredientID + "," + ingredients[i].price + ")\">";
                        html += "<div class=\"card_c\">";
                        html += "<img src=" + ingredients[i].picture + ">";
                        html += "<div class=\"card-body\">";
                        html += "<h5 class=\"card-title\">" + ingredients[i].name + "</h5>";
                        html += "<span>" + ingredients[i].massa + " г. / " + ingredients[i].price + " ₽</span></div></div></button>";
                        switch (ingredients[i].kategori_FK) {   //Заполняем разделы по категориям
                            case 2:
                                sous += html;
                                break;
                            case 3:
                                cheese += html;
                                break;
                            case 4:
                                meat += html;
                                break;
                            case 5:
                                fish += html;
                                break;
                            case 6:
                                grib += html;
                                break;
                            case 7:
                                herb += html;
                                break;
                            case 8:
                                species += html;
                                break;
                        }
                    }
                }
                $('#1otdel').html(sous);   //Добавление строк в html
                $('#2otdel').html(cheese); //Добавление строк в html
                $('#3otdel').html(meat);   //Добавление строк в html
                $('#4otdel').html(fish);   //Добавление строк в html
                $('#5otdel').html(grib);   //Добавление строк в html
                $('#6otdel').html(herb);   //Добавление строк в html
                $('#7otdel').html(species);//Добавление строк в html
                html = "<button type=\"button\" class=\"btn btn-warning\" onclick=\"product.createProduct()\">Создать</button>";
                $('#btn_build').html(html);//Добавление кнопки
            },
            error: function (xhr, ajaxOptions, thrownError) {   //Функция, исполняемая в случае неудачного запроса
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },

    //Выбор ингредиентов
    pushIng: function (id, price) {
        var color = $("#" + id + "").css("background-color");   //Получить цвет элемента
        if (color == "rgba(255, 0, 0, 0.3)") {                  //Проверяем выбран ли данный ингредиент
            $("#" + id + "").css('background-color', "#fff");   //Если выбран убираем цвет          
            ingredients.sostav.splice(ingredients.sostav.indexOf(id), 1);   //Удаляем id из массива
            ingredients.sum -= price;                                       //Изменить итоговую стоимость пиццы  
        }
        else {
            $("#" + id + "").css('background-color', "rgba(255,0,0,0.3)");  //Если не выбран, изменяем цвет
            ingredients.sostav.push(id);                                    //Добавляем id в массив
            ingredients.sum += price;                                       //Изменить итоговую стоимость пиццы          
        }
        $('#sum').val(ingredients.sum);
    },
};