$(document).ready(function () {     //Выполняется при загрузки страницы
    var href = document.location.href;
    var lastPathSegment = href.substr(href.lastIndexOf('/') + 1);   //Получаем название html файла
    if (lastPathSegment == "emailOk.html") {
        swal({
            title: "Отлично!",
            text: "Почта успешно подтверждена!",
            type: "success",
            showCancelButton: false,
            confirmButtonText: "Ок"
        },
        function () {
            $(location).attr('href', "../index.html");
        }); 
    } else {
        swal({
            title: "Ошибка!",
            text: "Почта не подтверждена!",
            type: "error",
            showCancelButton: false,
            confirmButtonText: "Ок"
        },
        function () {
            $(location).attr('href', "../index.html");
        }); 
    }
});