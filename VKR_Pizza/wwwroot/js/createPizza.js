$(document).ready(function () {     //Выполнить при загрузке страницы
    loading.init();
});

var createProduct = {
    sizeId: 1,      //Размер пиццы
    k: 0,
    ing: [],        //Состав пиццы
    massa: 0,       //Масса
    price: 0        //Цена
};

var countKategori = [];

var loading = {
    buttonpage: 1,  //Номер шага
    user: {},       //Данные о пользователе

    //Начальная инициализация
    init: function () {
        var us = jobCoocies.readCookies(0);   //Считываем куки пользователя
        //Проверка авторизован пользователь или нет
        if (!us)
            loading.user.role = "null"; //Если нет, роль по умолчанию null
        else loading.user = us;         //Если да, то роль пользователя
        var data = jobCoocies.readCookies(2);       //Считываем куки о составе
        //Если куки с составом есть
        if (data) {
            createProduct.sizeId = data.sizeId;     //Передаем размер
            createProduct.ing = data.ing;           //Передаем ингредиенты
            createProduct.massa = data.massa;       //Передаем массу
            createProduct.price = data.price;       //Передаем цену
            //Проверка, есть ли ингредиенты
            if (createProduct.ing.length > 0) {
                //Цикл по ингредиентам, вставляем картинки с ингредиентами
                for (var i in createProduct.ing) {
                    if (i != 0) {
                        if (!countKategori[createProduct.ing[i].ikat])
                            countKategori[createProduct.ing[i].ikat] = createProduct.ing[i].icount;
                        else countKategori[createProduct.ing[i].ikat] += createProduct.ing[i].icount;
                        $("#listIngImg").html($("#listIngImg").html() + "<img id=\"imageIng" + createProduct.ing[i].id + "\" class=\"ing_imgPizza\" src=\"image/ing_create/" + createProduct.ing[i].ipicture + "\" />");
                    }
                }
            }
        }
        this.page(1);   //Загружаем страницу 1
    },

    //Загрузка шага
    step: function (id) {
        id = id - 1;
        var idStep = ["#stepCreate1h", "#stepCreate2h", "#stepCreate3h"];
        //Цикл по шагам
        for (var i in idStep) {
            //Если выбранный шаг равен нужному
            if (id == i) {
                $(idStep[i]).addClass("step-active");
                $(idStep[i].substring(0, idStep[i].length - 1)).addClass("w-100");
            } else {
                $(idStep[i]).removeClass("step-active");
                if (id < i)
                    $(idStep[i].substring(0, idStep[i].length - 1)).removeClass("w-100");
            }
        }
    },

    //Загрузка страницы
    page: function (id) {
        let html = "";
        switch (id) {
            case 1: {
                $("#inform-pricesize").html("");
                this.step(1);
                html += "<h3>Выбор размера</h3>";
                html += "<div id=\"listSize\" class=\"list-group\"></div></div>";
            }; break;
            case 2: {
                this.step(2);   //Изменим шаг на 2
                html += "<h3>Выбор состава</h3>";
                html += "<div id=\"listKategori\" class=\"sostav-kategori w-100\"></div>";
                html += "<div id=\"listIngredients\" class=\"list-cardIng w-100\"></div>";              
            }; break;
            case 3: {
                this.step(3);
                if (this.user.role == "admin") {
                    html += "<h3>Данные о пицце</h3>";
                    html += "<form><div class='form-group'>";
                    html += "<label>Наименование пиццы</label>";
                    html += "<input type='text' class='form-control' placeholder='Маргарита' id='pizzaName'></div>";
                    html += "<div class='form-group'><label>Цена пиццы</label>";
                    html += "<input type='number' step='10' class='form-control' placeholder='225' id='pizzaPrice'></div>";
                    html += "<div class='form-group'><label>Картинка пиццы</label>";
                    html += "<input type='file' class='form-control-file' id='pizzaImage'></div></form>";
                }
                else {
                    html += "<h3>Состав пиццы</h3>";
                    html += "<ul class=\"list-group\">";
                    for (var i in createProduct.ing) {
                        html += "<li class=\"list-group-item d-flex justify-content-between align-items-center\">";
                        html += createProduct.ing[i].name;
                        html += "<span class=\"badge badge-primary badge-pill\">x" + createProduct.ing[i].icount + "</span></li>";
                    }
                    html += "</ul>";
                }
            }; break;
        }
        $('#mainPage').html(html);
        if (id == 1)
            Product.getSize();
        if (id == 2) {
            Ingredient.getKategori();
            Ingredient.getIng();
        }
        if (id == 3 && this.user.role == "admin") {
            $('#pizzaPrice').val(createProduct.price);  
            if (localStorage.getItem('ProductId')) {
                let pizza = JSON.parse(localStorage.getItem('ProductId'));
                $('#pizzaName').val(pizza.name);
            }
        }
    },

    //Кнопка вперед
    next: function () {
        //Если админ в конструкторе
        if (loading.buttonpage == 3 && loading.user.role == "admin") {
            if (!localStorage.getItem('ProductId'))
                Product.createProduct();
            else Product.updateProduct(JSON.parse(localStorage.getItem('ProductId')));
        }
        else
            if (loading.buttonpage == 3) {
                jobCoocies.writeCookies(null, 2);
                var data = jobCoocies.readCookies(1);    //Считываем данные из куков 
                var element = {};
                element.pCount = 1; //Количество
                element.pId = 1;    //id пиццы (конструктор 1)
                element.pImage = "konst.png";           //Картинка пиццы (конструктор)
                element.pName = "Конструктор";          //Название пиццы
                element.sId = createProduct.sizeId;     //Размер пиццы
                element.sName = Product.sizeList[Product.sizeList.findIndex(i => i.sizeId == createProduct.sizeId)].name;   //Наименование размера
                element.sPrice = createProduct.price;   //Цены пиццы
                element.sSize = Product.sizeList[Product.sizeList.findIndex(i => i.sizeId == createProduct.sizeId)].size;   //Размер пиццы в см
                element.ing = createProduct.ing;
                //Проверяем наличие данных
                if (data == null) { 
                    var arr = [];
                    arr.push(element);
                    jobCoocies.writeCookies(arr, 1);
                }
                else {
                    var j = data.findIndex(x => x.pId == element.pId && x.sId == element.sId && x.sPrice == element.sPrice);    //Ищем элемент в куках
                    if (j == -1) {
                        data.push(element); //Элемента нет, значит добавляем
                    }
                    else {
                        data[j].pCount += element.pCount;
                    }
                    jobCoocies.writeCookies(data, 1);
                }
                $(location).attr('href', "index.html");
            }
            else {
                jobCoocies.writeCookies(createProduct, 2);
                loading.buttonpage++;
                if (loading.buttonpage != 1) {
                    $("#butt-cancel").css('display', 'block');
                }
                if (loading.buttonpage == 3) {
                    if (this.user.role == "admin") {
                        if (!localStorage.getItem('ProductId')) {
                            Product.getImageList();
                            $("#butt-next").html("Создать пиццу");
                        }
                        else $("#butt-next").html("Изменить пиццу");
                    }
                    else {
                        $("#butt-next").html("Добавить в корзину");
                    }
                }
            }
            loading.page(loading.buttonpage);
    },

    //Кнопка назад
    cancel: function () {
        if (loading.buttonpage == 3) {
            $("#butt-next").html("Далее >");
        }
        loading.buttonpage--;
        if (loading.buttonpage != 1) {
            $("#butt-cancel").css('display', 'block');
        }
        else $("#butt-cancel").css('display', 'none');
        loading.page(loading.buttonpage);
    },

    //Изменение информации цены и размера
    swapSizePrice: function () {
        $("#inform-pricesize").html("Вес " + Math.floor(createProduct.massa) + " г.<br/>Цена " + Math.floor(createProduct.price) + " ₽");
    }
};

var Ingredient = {
    ingList: [],    //Список ингредиентов
    kategoriId: 2,  //Выбранная категория
    flag: false,    //флаг на удаление

    //Получение списка категорий
    getKategori: function () {
        $.ajax({
            url: '/api/kategori',
            type: 'GET',
            dataType: 'HTML',
            success: function (data) {
                var kat = JSON.parse(data);
                let html = "";
                for (var i in kat) {
                    if (i == 0) {
                        html += "<div id=\"kategori" + kat[i].kategoriId + "\" class=\"blok-kategori kategori-active\" onclick=\"Ingredient.selectCategori(" + kat[i].kategoriId + ")\">";
                    }
                    else {
                        html += "<div id=\"kategori" + kat[i].kategoriId + "\" class=\"blok-kategori\" onclick=\"Ingredient.selectCategori(" + kat[i].kategoriId +")\">";
                    }
                    html += "<div id=\"countk" + kat[i].kategoriId + "\">";
                    if (countKategori[kat[i].kategoriId])
                        html += "<span class=\"kategori-count\">" + countKategori[kat[i].kategoriId] +"</span>";
                    html += "</div><img src=\"image/kategori/" + kat[i].picture + "\">";
                    html += "<p>" + kat[i].name + "</p></div>";
                }
                $('#listKategori').html(html);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },

    //Вывод количества ингредиентов у подкатегорий
    viewCountKategori: function (id) {
        if (countKategori[id] == 0) {
            $("#countk" + id).html("");
        }
        else {
            $("#countk" + id).html("<span class=\"kategori-count\">" + countKategori[id] +"</span>");
        }
    },

    //Получение ингредиентов
    getIng: function () {
        $.ajax({                        
            url: '/api/ingredient',     
            type: 'GET',                
            dataType: 'HTML',           
            success: function (data) { 
                Ingredient.ingList = JSON.parse(data);     //Разбирает строку JSON
                if (loading.user.role != "admin")
                    Ingredient.ingList = Ingredient.ingList.filter(i => i.availability);
                if (createProduct.massa == 0) {
                    var informIng = {};     //Информация об ингредиенте
                    informIng.id = 1;                      //id ингредиента
                    informIng.name = Ingredient.ingList[0].name;        //Наименование
                    informIng.icount = 1;                   //количество данного вида ингредиента
                    informIng.ikat = Ingredient.ingList[0].kategori_FK; //id категории
                    informIng.ipicture = Ingredient.ingList[0].picture; //картинка
                    informIng.imassa = Ingredient.ingList[0].massa;     //масса
                    informIng.iprice = Ingredient.ingList[0].price;
                    createProduct.ing.push(informIng);
                    createProduct.massa = Ingredient.ingList[0].massa * createProduct.k;
                    createProduct.price = Ingredient.ingList[0].price * createProduct.k;
                }
                loading.swapSizePrice();
                Ingredient.selectCategori(2);
            },
            error: function (xhr, ajaxOptions, thrownError) {   //Функция, исполняемая в случае неудачного запроса
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },

    //Выбор категории
    selectCategori: function (id) {
        let html = "";
        for (var i in Ingredient.ingList) {        //Цикл по всем ингредиентам
            if (Ingredient.ingList[i].kategori_FK == id) {
                html += "<div id=\"cardIng" + Ingredient.ingList[i].ingredientID + "\" class=\"cardIng\" onclick=\"Ingredient.selectIng(" + Ingredient.ingList[i].ingredientID + ")\">";
                html += "<div id=\"cardSpanIng" + Ingredient.ingList[i].ingredientID + "\"></div>";
                html += "<img src=\"image/ing/" + Ingredient.ingList[i].picture + "\">";
                html += "<div class=\"IngText\">" + Ingredient.ingList[i].name + "</div>";
                html += "<div class=\"IngText\">" + Math.floor(Ingredient.ingList[i].massa * createProduct.k) + " г. / " + Math.floor(Ingredient.ingList[i].price * createProduct.k) + " ₽</div></div>";
            }
        }
        $("#kategori" + this.kategoriId).removeClass("kategori-active");
        $("#kategori" + id).addClass("kategori-active");
        this.kategoriId = id;
        $('#listIngredients').html(html);
        if (createProduct.ing.length > 0)
            for (var i in createProduct.ing) {
                if (createProduct.ing[i].ikat == id) {
                    $("#cardIng" + createProduct.ing[i].id).addClass("cardIng-active");
                    html = "<span id=\"cardSpanIngCount" + createProduct.ing[i].id + "\" class=\"Img_count\">x" + createProduct.ing[i].icount + "</span>";
                    html += "<span class=\"Img_remove\" onclick=\"Ingredient.delIngredient(" + createProduct.ing[i].id + ")\"><i class=\"bi bi-x-circle\"></i></span>";
                    $("#cardSpanIng" + createProduct.ing[i].id).html(html);
                }
            }
    },

    //Выбор ингредиента
    selectIng: function (id) {
        let html = "";
        var informIng = {};     //Информация об ингредиенте
        if (!Ingredient.flag) {
            var selectIng = Ingredient.ingList[Ingredient.ingList.findIndex(item => item.ingredientID == id)];  //Выбранный ингредиент
            var i = createProduct.ing.findIndex(item => item.id == id);     //Ищем добавляемый элемент
            if (i != -1) {
                if (createProduct.ing[i].icount < 2) {
                    if (createProduct.massa < 1000) {
                        createProduct.ing[i].icount++;  //Увеличиваем количество
                        countKategori[createProduct.ing[i].ikat] += 1;
                        createProduct.massa += Math.floor(selectIng.massa * createProduct.k);
                        createProduct.price += Math.floor(selectIng.price * createProduct.k);
                        $("#cardSpanIngCount" + id).html("x" + createProduct.ing[i].icount);
                    }
                    else Ingredient.viewInformation();
                }
                else {
                    $("#cardIng" + id).removeClass("cardIng-active");
                    $("#cardSpanIng" + id).html("");
                    createProduct.massa -= Math.floor(selectIng.massa * createProduct.ing[i].icount * createProduct.k);
                    createProduct.price -= Math.floor(selectIng.price * createProduct.ing[i].icount * createProduct.k);
                    createProduct.ing.splice(i, 1);    //Удаляем элемент из массива
                    $("#imageIng" + id).remove();      //Удаляем картинку данного ингредиента
                    countKategori[selectIng.kategori_FK] -= 2;
                }
            }
            else {
                if (createProduct.massa < 1000) {
                    $("#cardIng" + id).addClass("cardIng-active");
                    html += "<span id=\"cardSpanIngCount" + id + "\" class=\"Img_count\">x1</span>";
                    html += "<span class=\"Img_remove\" onclick=\"Ingredient.delIngredient(" + id + ")\"><i class=\"bi bi-x-circle\"></i></span>";
                    $("#cardSpanIng" + id).html(html);
                    informIng.id = id;                      //id ингредиента
                    informIng.name = selectIng.name;        //Наименование
                    informIng.icount = 1;                   //количество данного вида ингредиента
                    informIng.ikat = selectIng.kategori_FK; //id категории
                    informIng.ipicture = selectIng.picture; //картинка
                    informIng.imassa = selectIng.massa;     //масса
                    informIng.iprice = selectIng.price;
                    if (!countKategori[selectIng.kategori_FK]) {
                        countKategori[selectIng.kategori_FK] = 1;
                    } else countKategori[selectIng.kategori_FK] += 1;
                    
                    createProduct.ing.push(informIng);
                    createProduct.massa += Math.floor(selectIng.massa * createProduct.k);
                    createProduct.price += Math.floor(selectIng.price * createProduct.k);
                    $("#listIngImg").html($("#listIngImg").html() + "<img id=\"imageIng" + id + "\" class=\"ing_imgPizza\" src=\"image/ing_create/" + selectIng.picture + "\" />");
                    Product.selectSizeImage();
                }
                else Ingredient.viewInformation();
            }
            Ingredient.viewCountKategori(selectIng.kategori_FK);
        } else Ingredient.flag = false;
        loading.swapSizePrice();
    },

    //Удалить ингредиент
    delIngredient: function (id) {
        Ingredient.flag = true;
        var selectIng = Ingredient.ingList[Ingredient.ingList.findIndex(item => item.ingredientID == id)];  //Выбранный ингредиент
        var i = createProduct.ing.findIndex(item => item.id == id);     //Ищем удаляемый элемент
        $("#cardIng" + id).removeClass("cardIng-active");
        $("#cardSpanIng" + id).html("");
        createProduct.massa -= Math.floor(selectIng.massa * createProduct.ing[i].icount);
        createProduct.price -= Math.floor(selectIng.price * createProduct.ing[i].icount);
        countKategori[selectIng.kategori_FK] -= createProduct.ing[i].icount;
        createProduct.ing.splice(i, 1);    //Удаляем элемент из массива
        $("#imageIng" + id).remove();      //Удаляем картинку данного ингредиента
        Ingredient.viewCountKategori(selectIng.kategori_FK);
        loading.swapSizePrice();
    },

    //Сообщение об ошибке
    viewInformation: function () {
        $('#message').show(0, function () {
            setTimeout(function () {
                $('#message').hide(500);
            }, 2000);
        });
    }
};

var Product = {
    listImage: [],  //Список существующих картинок
    sizeList: [],   //Список размеров
    w: 67,
    ml: 16,
    mt: -82,

    //Получить размер пиццы
    getSize: function () {
        $.ajax({
            url: '/api/sizepizza',
            type: 'GET',
            dataType: 'HTML',
            success: function (data) {
                Product.sizeList = JSON.parse(data);
                let html = "";
                var dw = 85;
                var dl = 8;
                var dt = -85;
                for (var i in Product.sizeList) {
                    html += "<button id='sizeId" + Product.sizeList[i].sizeId + "' type='button' onclick=\"Product.sizeImg(" + Product.sizeList[i].sizeId + "," + dw + "," + dl + "," + dt + ")\" class='list-group-item list-group-item-action'>";
                    html += Product.sizeList[i].name + "</button>";
                    dw += 24;
                    dl += -12;
                    dt += -11;
                    if (loading.user.role == "admin")
                        break;
                }
                $('#listSize').html(html);
                createProduct.k = Product.sizeList[Product.sizeList.findIndex(i => i.sizeId == createProduct.sizeId)].k;
                $("#sizeId" + createProduct.sizeId).addClass("active");
                $("#sizeId" + createProduct.sizeId).click();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },

    //Получение существующих картинок
    getImageList: function () {
        $.ajax({
            url: '/api/product/listImage',
            type: 'GET',
            dataType: 'HTML',
            success: function (data) {
                Product.listImage = JSON.parse(data);
            }
        });
    },

    //Изменение размера основы
    sizeImg: function (id, w, ml, mt) {
        $("#size_imgPizza").css('width', w + '%');
        $("#size_imgPizza").css('margin-left', ml + '%');
        $("#size_imgPizza").css('margin-top', mt + '%');
        Product.m = (w - 18);
        Product.ml = (ml + 8);
        Product.mt = (mt + 3);
        Product.selectSizeImage();
        $("#sizeId" + id).addClass("active");
        createProduct.sizeId = id;                           //Запоминаем выбранный размер
        createProduct.k = Product.sizeList[Product.sizeList.findIndex(i => i.sizeId == id)].k;  //Запоминаем коэффициент размера
        if (createProduct.massa != 0 && !localStorage.getItem('ProductId')) {
            createProduct.massa = 0;
            createProduct.price = 0;
            for (var i in createProduct.ing) {
                createProduct.massa += createProduct.ing[i].imassa * createProduct.k * createProduct.ing[i].icount;
                createProduct.price += createProduct.ing[i].iprice * createProduct.k * createProduct.ing[i].icount;
            }
            Math.floor(createProduct.massa);
            Math.floor(createProduct.price);
        }
        for (var i = 0; i < Product.sizeList.length; i++)
            if (i != id - 1)
                $("#sizeId" + (i + 1)).removeClass("active");
    },

    //Изменение размеров картинок добавляемых ингредиентов
    selectSizeImage: function () {
        $('*[class="ing_imgPizza"]').css('width', Product.m + '%');
        $('*[class="ing_imgPizza"]').css('margin-left', Product.ml + '%');
        $('*[class="ing_imgPizza"]').css('margin-top', Product.mt + '%');
    },

    //Создать пиццу
    createProduct: function () {
        var flag1 = true;   //Добавление картинки
        var flag2 = true;   //Добавление ингредиента
        var name = $('#pizzaName').val();       //Наименование пиццы
        var price = $('#pizzaPrice').val();     //Цена пиццы
        var sostav = createProduct.ing;         //Состав пиццы
        var image = $("#pizzaImage").val().replace(/.*[\/\\]/, '').toLowerCase();     //Картинка пиццы
        if (Product.listImage.indexOf(image) != -1) {
            flag1 = confirm("Изображение с таким названием уже существует, заменить его?");
            if (!flag1)
                flag2 = confirm("Продолжить добавление новой пиццы (изображение будет использовано уже существующие)?");
        }
        var formData = new FormData();
        formData.append('file1', $("#pizzaImage")[0].files[0]);
        if (flag2) {
            $.ajax({
                url: '/api/product',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    name: name,
                    price: price,
                    sostav: sostav,
                    picture: image
                }),
                success: function (data) {
                    jobCoocies.writeCookies(null, 2);
                    if (flag1)
                        Product.uploadImage(formData);
                    else {
                        $(location).attr('href', "index.html");
                    }                                       
                },
                statusCode: {
                    401: function () {
                        alert("У вас недостаточно прав для создания");
                    }
                }
            });
        }
    },

    //Изменить пиццу
    updateProduct: function (pizza) {
        var name = $('#pizzaName').val();       //Наименование пиццы
        var price = $('#pizzaPrice').val();     //Цена пиццы
        var sostav = createProduct.ing;         //Состав пиццы
        var image = $("#pizzaImage").val();     //Картинка пиццы
        var formData = new FormData();
        formData.append('file1', $("#pizzaImage")[0].files[0]);
        $.ajax({                            
            url: '/api/product/' + pizza.id,      
            type: 'PUT',                    
            contentType: 'application/json',
            data: JSON.stringify({          
                name: name,
                price: price,
                sostav: sostav
            }),
            success: function (data) {      
                jobCoocies.writeCookies(null, 2);
                if (image != "") {
                    formData.append('nameFile', data);
                    Product.uploadImage(formData);
                }
                else $(location).attr('href', "index.html");
            }
        });
    },

    //Загрузка картинки на сервер
    uploadImage: function (formData) {
        $.ajax({
            url: '/api/ImageUpload/productImg',
            type: 'POST',
            contentType: false,
            processData: false,
            data: formData,
            success: function (data) {
                $(location).attr('href', "index.html");
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}