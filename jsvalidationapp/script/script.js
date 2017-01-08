'use strict';

// Описание скрипта ============================================================
// Скрипт для проверки вводимых значений в полях форм
//
// структура HTML формы ========================================================
// <div class="form-group">
//     <label class="control-label">...</label>
//     <input type="email" class="form-control" placeholder="...">
//     <span class="help-block"></span>
// </div>
// только в таком виде навешивание стандартных bootstrap классов для валидации
// будет подкрашивать элементы формы
// структура HTML формы ========================================================
//
// Установочные дата-атрибуты в шаблонах HTML
//
// Если форму нужно валидировать, на формие ставим дата атрибут: ===============
// data-js-validation="true"
// в случае если нужно быстро отключить валидацию на форме, то можно выставлять
// значение атрибута равное false
// =============================================================================
//
// Если поле обязательно для заполнения: =======================================
// То указываем дата атрибут
// data-validation-require="true"
// в случае если нужно быстро отключить проверку на обязательное поле, то ставим
// значение атрибута равное false
// =============================================================================
//
// Шаблоны по которым можно валидиролвать: =====================================
// data-validation-templ=
// указываем различные шаблоны, которые берем из настроечного объекта
// @Param validators {object} объект в котором шаблоны со строками
// в виде регулярных выражений
//
// data-validation-custom=""
// в значении можно указывать кастомную строку в виде регулярки
// =============================================================================
//
// Описание скрипта ============================================================

// TODO вынести в отдельную функцию код добавления(удаления) сообщения
// при валидации полей формы

let form1 = document.getElementById('form1');
let form2 = document.getElementById('form2');
let form1SubmitBtn = document.getElementById('form1SubmitBtn');
let form2SubmitBtn = document.getElementById('form2SubmitBtn');

// установочные переменые ======================================================
let validators = {
    clean : {
        errorMsg: ''
    },
    requireField : {
        errorMsg: 'Поле является обязательным для заполнения'
    },
    phone : {
        regExprPattern: '^((8|\\+7)[\\- ]?)?(\\(?\\d{3}\\)?[\\- ]?)?[\\d\\- ]{7,10}$',
        regExprFlags: '',
        errorMsg: 'В поле нужно вводить номер телефона, в формате: +7(XXX)XXX-XXXX'
    },
    email : {
        regExprPattern: '.+@.+\\..+',
        regExprFlags: 'i',
        errorMsg: 'В поле нужно вводить email, в формате: someaddress@domain.xxx'
    }
};
// установочные переменые ======================================================

// вспомогательные функции======================================================
// Функция сравнивающая является ли поле обязательным для заполнения
/**
* Функция проверки заполнено ли поле
* @param  {DOM ELEMENT} inputDOM   проверяемый инпут
* @return {boolean}                если поле пустое то возвращается false
*                                  иначе true
*/
function checkInputForRequire( inputDOM ) {
    if ( !inputDOM.value ) {
        return false;
    }
    return true;
}; // checkInputForRequire

// Функция сравнивающая данные в поле с предустановленной регуляркой
/**
* [checkInputTemplRegular проверка на соответсвие данных введенных в поле
* на соответсвие регулярному выражению
* @param  {string} validatorStr      тип валидируемого шаблона, указанный для поля (пример: email, phone и т.д.)
* @param  {DOM Element} inputDOM     DOM элемент, input из валидируемой формы
* @return {boolean}                  если строка в поле совпадает с регуляркой, то true
*                                    иначе false
*/
function checkInputTemplRegular( validatorStr, inputDOM ) {
    let validObj = validators[validatorStr];
    let string = inputDOM.value;
    let expression;

    // построить регулярку в зависимости о наличия флагов
    if ( validObj.regExprFlags === '' ) {
        expression = new RegExp(validObj.regExprPattern);
    } else {
        expression = new RegExp(validObj.regExprPattern, validObj.regExprFlags);
    }

    // проверка на соответсвие строки из инпута, шаблонной регулярке
    if ( expression.test(string) ) {
        return true;
    } else {
        return false;
    }

}; // checkInputTemplRegular

// функция для вывода сообщения об ошибке require, а так же о выделении инпута красным
// TODO FIXME теперь это универсальная функция. ПЕРЕИМЕНУЙ ЕЕ И НАПИШИ ДОКУМЕНТАЦИЮ
// TODO предусмотреть задание классов для отвалидированного поля, например зелененьким;)
function requireValidateStatusInDOM( isErrorInInput, inputDOM, validatorErrorMsg ) {
    let parentDOM = inputDOM.parentElement;
    let nextDOM = inputDOM.nextElementSibling;
    if ( isErrorInInput === false ) {
        parentDOM.classList.add('has-error');
        nextDOM.innerHTML = validatorErrorMsg;
    } else {
        parentDOM.classList.remove('has-error');
        nextDOM.innerHTML = validators.clean.errorMsg;
    }
    return;
}; //requireErrValidateStatusInDOM
// вспомогательные функции======================================================

// Обработчики событий =========================================================
// Вадидация формы
function handleFormValidate(e, form) {
    e.preventDefault();
    let checkStatus = false;
    let checkFormStatus = false;
    let isNeedFormValidate = form.getAttribute('data-js-validation');
    let allFormInputs = undefined;
    let isRequire = '';
    let validator = '';
    let customValidator = '';

    if ( isNeedFormValidate === 'true' ) {
        allFormInputs = form.getElementsByTagName('input');

        if ( allFormInputs.length !== 0 ) {
            // проверка на ОБЯЗАТЕЛЬНОСТЬ полей
            for (let i=0;i<allFormInputs.length;i++) {
                isRequire = allFormInputs[i].getAttribute('data-validation-require');
                if ( isRequire === 'true' ) {
                    checkStatus = checkInputForRequire( allFormInputs[i] );
                    checkFormStatus = checkStatus;
                    requireValidateStatusInDOM( checkStatus, allFormInputs[i], validators.requireField.errorMsg );
                }
            }  // окончание проверки на ОБЯЗАТЕЛЬНОСТЬ полей

            // проверка полей на соответсвие вводимых значений
            if ( checkFormStatus ) {
                for (let i=0;i<allFormInputs.length;i++) {
                    validator = allFormInputs[i].getAttribute('data-validation-templ');
                    customValidator = allFormInputs[i].getAttribute('data-validation-custom');

                    if ( validator ) {
                        checkStatus = checkInputTemplRegular( validator, allFormInputs[i] )
                        requireValidateStatusInDOM( checkStatus, allFormInputs[i], validators[validator].errorMsg );
                    } else if ( customValidator ) {
                        // TODO вызывать функцию для проверки кастомной регулярки
                    }

                }
            } // окончание проверки полей на соответсвие вводимых значений

        } else {
            return;
        }
    } else {
        // TODO здесь отдавать в BACK-END
    }


} // handleFormValidate
// Обработчики событий =========================================================








// события на DOM элементах ====================================================
// событие клик на кнопке "крестик"(перемещение справа-на-лево) в левой и правых стронах
form1SubmitBtn.addEventListener('click', (e) => { handleFormValidate(e, form1); } );
form2SubmitBtn.addEventListener('click', (e) => { handleFormValidate(e, form2); } );
// события на DOM элементах ====================================================
