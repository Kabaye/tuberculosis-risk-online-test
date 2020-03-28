const form = document.getElementById('form');
const age = document.getElementById('input-input-age');
const reactionSize = document.getElementById('select-size-of-reaction');
const error = document.querySelectorAll('.error');
const results = $('#results');

let currentLocalizationJson;

const checkCheckboxes = function (elem) {
    if (elem === 1) {
        document.getElementById('epidemic-factor2').checked = false;
    } else {
        document.getElementById('epidemic-factor1').checked = false;
    }
};

age.addEventListener('input', function () {
    if (!age.validity.valid) {
        error[0].innerHTML = currentLocalizationJson['input-age-invalid'];
        error[0].className = 'error';
    } else if (age.validity.valid) {
        error[0].innerHTML = '';
        error[0].className = 'error';
    }
}, false);

reactionSize.addEventListener('input', function () {
    if (!reactionSize.validity.valid) {
        error[1].innerHTML = currentLocalizationJson['select-size-of-reaction-invalid'];
        error[1].className = 'error';
    } else if (reactionSize.validity.valid) {
        error[1].innerHTML = '';
        error[1].className = 'error';
    }
}, false);

form.addEventListener('submit', function (event) {
    let isError = false;
    if (!age.validity.valid) {
        isError = true;
        event.preventDefault();
    }
    if (!reactionSize.validity.valid) {
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
            age: parseInt(age.value),
            reactionSizeNum: parseInt(reactionSize.value),
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

        event.preventDefault();
        document.getElementById('clear-button').click();
    }

}, false);

function onResponse(data) {
    results.empty();
    results.prepend('<h3 class="col-2 my-auto" id="results-title">' + currentLocalizationJson['results-title'] + '</h3>');
    if (data.risk === 'LOW') {
        results.append('<div class="col-2 my-auto">' + currentLocalizationJson['low-risk-text'] + '</div>');
    }
    if (data.risk === 'MEDIUM') {
        results.append('<div class="col-2 my-auto">' + currentLocalizationJson['middle-risk-text'] + '</div>');
        results.append('<div class="text-warning text-justify col-8">' + currentLocalizationJson['middle-risk-recommendation'] + '</div>');
    }
    if (data.risk === 'HIGH') {
        results.append('<div class="col-2 my-auto">' + currentLocalizationJson['high-risk-text'] + '</div>');
        results.append('<div class="text-danger text-justify col-8">' + currentLocalizationJson['high-risk-recommendation'] + '</div>');
    }
    if (data.risk === 'VERY_HIGH') {
        results.append('<div class="col-2 my-auto">' + currentLocalizationJson['very-high-risk-text'] + '</div>');
        results.append('<div class="text-danger text-justify font-weight-bold col-8">' + currentLocalizationJson['very-high-risk-recommendation'] + '</div>');
    }
}

function onFail() {
    results.empty();
    results.prepend('<h5 class="text-danger font-weight-bold ml-4">' + currentLocalizationJson['error-msg'] + '</h5>');
}

function checkLocalization() {
    $('.localization').each(function () {
        let el = $(this);
        let key = (el.attr('id'));
        if (key.includes('lang-img')) {
            el.append(currentLocalizationJson[key]);
        } else if (key.includes('input-input')) {
            el[0].placeholder = currentLocalizationJson[key];
        } else {
            el.prepend(currentLocalizationJson[key]);
        }
    });
    let src = $('#' + userLang + '-img')[0].src;
    src = src.substring(src.indexOf('img'));
    $("#main-lang").html('<img alt="" src="' + src + '">');
}

let defDoc = $.Deferred();
let defJson = $.Deferred();
$(document).ready(() => {
    defDoc.resolve();
});

$.getJSON('language/' + userLang + '-localization.json', function (result) {
    currentLocalizationJson = result;
    defJson.resolve();
});
$.when(defDoc, defJson).done(() => {
checkLocalization();
})
;