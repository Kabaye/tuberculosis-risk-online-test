let form = document.getElementById('form');
let age = document.getElementById('input-age');
let reactionSize = document.getElementById('input-size-of-reaction');
let error = document.querySelectorAll('.error');
let results = $('#results');

const checkCheckboxes = function (elem) {
    if (elem === 1) {
        document.getElementById('epidemic-factor2').checked = false;
    } else {
        document.getElementById('epidemic-factor1').checked = false;
    }
};

//TODO 27.03.2020 add runtime validation!
age.addEventListener("input", function () {
    if (age.validity.valid) {
        error[0].innerHTML = "";
        error[0].className = "error";
    }
}, false);

reactionSize.addEventListener("input", function () {
    if (reactionSize.validity.valid) {
        error[1].innerHTML = "";
        error[1].className = "error";
    }
}, false);

form.addEventListener("submit", function (event) {
    let isError = false;
    if (!age.validity.valid) {
        error[0].innerHTML = "Возраст должен быть между 1 и 19";
        error[0].className = "error active";
        isError = true;
        event.preventDefault();
    }
    if (!reactionSize.validity.valid) {
        error[1].innerHTML = "Выберите размер реакции";
        error[1].className = "error active";
        isError = true;
        event.preventDefault();
    }

    function calculateEpidemicFactor() {
        let check1 = document.getElementById('epidemic-factor1').checked;
        let check2 = document.getElementById('epidemic-factor2').checked;
        if (check1) {
            return 1;
        } else if (check2) {
            return 2;
        } else {
            return 0;
        }
    }

    if (!isError) {
        let value = {
            age: parseInt(document.getElementById('input-age').value),
            reactionSizeNum: parseInt(document.getElementById('input-size-of-reaction').value),
            affectedByChernobyl: document.getElementById('affected-by-chernobyl').checked,
            epidemicFactor: calculateEpidemicFactor(),
            medicalFactor: document.getElementById('medical-factor').checked,
            socialFactor: document.getElementById('social-factor').checked
        };

        let request = $.ajax(
            {
                url: '/api/v1/web-test/calculate',
                type: 'POST',
                data: JSON.stringify(value),
                contentType: 'application/json; charset=utf-8'
            }
        );

        request.done(onResponse);
        request.fail(onFail);

        // let xhr = new XMLHttpRequest();
        // xhr.open('POST', '/api/v1/web-test/calculate', true);
        // xhr.responseType = 'json';
        // xhr.setRequestHeader('Content-Type', 'application/json');
        // xhr.send(JSON.stringify(value));
        // xhr.onload = function () {
        //     if (xhr.status === 200) {
        //         alert(xhr.response)
        //     } else{
        //         alert('PROBLEMS!!!!!!!')
        //     }
        // }
        event.preventDefault();
        document.getElementById('clear-button').click();
    }

}, false);

function onResponse(data) {
    results.empty();
    results.prepend('<h3 class="col-2 my-auto" id="results-title">Результат:</h3>');
    if (data.risk === 'LOW') {
        results.append('<div class="col-2 my-auto">Риск - <span class="text-success">маленький</span></div>');
    }
    if (data.risk === 'MEDIUM') {
        results.append('<div class="col-2 my-auto">Риск - <span class="text-warning">средний</span></div>');
        results.append('<div class="text-warning text-justify col-8">Рекомендуется повторить иммунодиагностику' +
            'туберкулеза в амбулаторно-поликлинических условиях с целью подтверждения или исключения латентной ' +
            'туберкулезной инфекции.</div>');
    }
    if (data.risk === 'HIGH') {
        results.append('<div class="col-2 my-auto">Риск - <span class="text-danger text-uppercase font-weight-bold">высокий</span></div>');
        results.append('<div class="text-danger text-justify col-8">Рекомендуется провести дополнительное углубленное обследование\n' +
            'на туберкулез с использованием рентгенологических, бактериологических и иных методов в условиях учреждений\n' +
            'здравоохранения, оказывающих специализированную противотуберкулезную помощь населению</div>');
    }
    if (data.risk === 'VERY_HIGH') {
        results.append('<div class="col-2 my-auto">Риск - <span class="text-danger text-uppercase font-weight-bold">очень высокий</span></div>');
        results.append('<div class="text-danger text-justify font-weight-bold col-8">Рекомендуется провести дополнительное углубленное обследование\n' +
            'на туберкулез с использованием рентгенологических, бактериологических и иных методов в условиях учреждений\n' +
            'здравоохранения, оказывающих специализированную противотуберкулезную помощь населению</div>');
    }
}

function onFail() {
    results.empty();
    results.prepend('<h5 class="text-danger font-weight-bold ml-4">Что-то пошло не так! Сервер не доступен!</h5>');
}

function changeLocalization() {

}

$(document).ready(function () {
    $("#not-active-languages a").on("click", function () {
        let id = $(this).data('dropdown-val');
        let src = $('#'+id+'-img')[0].src;
        src = src.substring(src.indexOf('img'));
        $("#main-lang").html('<img alt="" src="'+src+'">');
        changeLocalization();
    });
});
