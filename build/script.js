'use strict';

// установочные переменые 123 ======================================================

var validators = {
    classes: {
        hasError: 'has-error',
        hasSucess: 'has-success'
    },
    clean: {
        errorMsg: ''
    },
    requireField: {
        errorMsg: 'Поле является обязательным для заполнения'
    },
    phone: {
        regExprPattern: '^((8|\\+7)[\\- ]?)?(\\(?\\d{3}\\)?[\\- ]?)?[\\d\\- ]{7,10}$',
        regExprFlags: '',
        errorMsg: 'В поле нужно вводить номер телефона, в формате: +7(XXX)XXX-XXXX'
    },
    email: {
        regExprPattern: '.+@.+\\..+',
        regExprFlags: 'i',
        errorMsg: 'В поле нужно вводить email, в формате: someaddress@domain.xxx'
    },
    customValidator: {
        regExprPattern: '',
        regExprFlags: '',
        errorMsg: ''
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
function checkInputForRequire(inputDOM) {
    if (!inputDOM.value) {
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
function checkInputTemplRegular(validatorStr, inputDOM) {
    var validObj = validators[validatorStr];
    var string = inputDOM.value;
    var expression = void 0;

    // построить регулярку в зависимости о наличия флагов
    if (validObj.regExprFlags === '') {
        expression = new RegExp(validObj.regExprPattern);
    } else {
        expression = new RegExp(validObj.regExprPattern, validObj.regExprFlags);
    }

    // проверка на соответсвие строки из инпута, шаблонной регулярке
    if (expression.test(string)) {
        return true;
    } else {
        return false;
    }
}; // checkInputTemplRegular

// функция для вывода сообщения об ошибке и выделении инпута в цвет ошибки (например красный)
// TODO предусмотреть задание классов для отвалидированного поля, например зелененьким;)
/**
 * setValidateStatusInDOM сообщение об ошибке, если поле не прошло валидацию
 * @param {Boolean} isErrorInInput    есть ошибка в input формы или нет
 * @param {DOM Element}  inputDOM     DOM элемент, input из валидируемой формы
 * @param {string}  validatorErrorMsg сообщение об ошибке
 */
function setValidateStatusInDOM(isErrorInInput, inputDOM, validatorErrorMsg) {
    var parentDOM = inputDOM.parentElement;
    var nextDOM = inputDOM.nextElementSibling;
    if (isErrorInInput === false) {
        parentDOM.classList.add(validators.classes.hasError);
        nextDOM.innerHTML = validatorErrorMsg;
    } else {
        parentDOM.classList.remove(validators.classes.hasError);
        nextDOM.innerHTML = validators.clean.errorMsg;
    }
    return;
}; //requireErrValidateStatusInDOM
// вспомогательные функции======================================================

// Обработчики событий =========================================================

/**
 * [Вадидация формы. Экспортируемая функция]
 * @param  {Event} e   [Event object]
 * @param  {Boolean} log [Print logs to a console]
 * @return {undefined}     [nothing]
 */
module.exports = function handleFormValidate(e, log) {
    var isPrintLogs = log || false,
        target = e.target,
        checkStatus = false,
        checkFormStatus = false,
        isNeedFormValidate = undefined,
        allFormInputs = undefined,
        isRequire = '',
        validator = '',
        customValidator = '';
    target.noValidate = true; // Отключить браузерную валидацию для формы

    if (target.tagName === 'FORM') {
        isNeedFormValidate = target.getAttribute('data-js-validation');
        if (isNeedFormValidate === 'true') {
            allFormInputs = target.getElementsByTagName('input');

            if (allFormInputs.length !== 0) {
                // проверка на ОБЯЗАТЕЛЬНОСТЬ полей
                for (var i = 0; i < allFormInputs.length; i++) {
                    isRequire = allFormInputs[i].getAttribute('data-validation-require');
                    if (isRequire === 'true') {
                        checkStatus = checkInputForRequire(allFormInputs[i]);
                        checkFormStatus = checkStatus;
                        setValidateStatusInDOM(checkStatus, allFormInputs[i], validators.requireField.errorMsg);
                    }
                } // окончание проверки на ОБЯЗАТЕЛЬНОСТЬ полей

                // проверка полей на соответсвие вводимых значений
                if (checkFormStatus) {
                    for (var _i = 0; _i < allFormInputs.length; _i++) {
                        validator = allFormInputs[_i].getAttribute('data-validation-templ');
                        customValidator = allFormInputs[_i].getAttribute('data-validation-custom');

                        if (validator) {
                            checkStatus = checkInputTemplRegular(validator, allFormInputs[_i]);
                            checkFormStatus = checkStatus;
                            setValidateStatusInDOM(checkStatus, allFormInputs[_i], validators[validator].errorMsg);
                        } else if (customValidator) {
                            var customValidatorArray = customValidator.split(';');
                            var _validator = 'customValidator';

                            // уберрем кавычки из начала и конца строки
                            for (var _i2 = 0; _i2 < customValidatorArray.length; _i2++) {
                                customValidatorArray[_i2] = customValidatorArray[_i2].slice(1, -1);
                            }

                            // наполним объект кастомной строкой для валидации
                            validators.customValidator.regExprPattern = customValidatorArray[0];
                            validators.customValidator.regExprFlags = customValidatorArray[1];
                            validators.customValidator.errorMsg = customValidatorArray[2];

                            checkStatus = checkInputTemplRegular(_validator, allFormInputs[_i]);
                            checkFormStatus = checkStatus;
                            setValidateStatusInDOM(checkStatus, allFormInputs[_i], validators[_validator].errorMsg);

                            // почистим объект кастомного валидатора
                            validators.customValidator.regExprPattern = '';
                            validators.customValidator.regExprFlags = '';
                            validators.customValidator.errorMsg = '';
                        }
                    }
                } // окончание проверки полей на соответсвие вводимых значений

                // Если в инпутах формы есть ошибки, то форму не отправлять
                if (!checkFormStatus) {
                    if (isPrintLogs) console.log('В инпутах есть ошибка. Форма не отправлена');
                    e.preventDefault();
                } else {
                    if (isPrintLogs) console.log('Ошибок нет. Форма отправлена!');
                }
            } else {
                e.preventDefault();
                return;
            }
        } else {
            // TODO здесь отдавать в BACK-END, убрать preventDefault
            if (isPrintLogs) console.log('Форма поехала в бекэнд');
        }
    }
}; // handleFormValidate
// Обработчики событий =========================================================
