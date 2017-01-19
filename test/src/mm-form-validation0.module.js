'use strict';

// установочные переменые ======================================================
let validators = {
    classes : {
        hasError: 'has-error',
        hasSucess: 'has-success'
    },
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

// функция для вывода сообщения об ошибке и выделении инпута в цвет ошибки (например красный)
// TODO предусмотреть задание классов для отвалидированного поля, например зелененьким;)
/**
 * setValidateStatusInDOM сообщение об ошибке, если поле не прошло валидацию
 * @param {Boolean} isErrorInInput    есть ошибка в input формы или нет
 * @param {DOM Element}  inputDOM     DOM элемент, input из валидируемой формы
 * @param {string}  validatorErrorMsg сообщение об ошибке
 */
function setValidateStatusInDOM( isErrorInInput, inputDOM, validatorErrorMsg ) {
    let parentDOM = inputDOM.parentElement;
    let nextDOM = parentDOM.getElementsByTagName('span');
    if ( isErrorInInput === false ) {
        parentDOM.classList.add(validators.classes.hasError);
        nextDOM[0].innerHTML = validatorErrorMsg;             //берем самый первый span внутри родителя
    } else {
        parentDOM.classList.remove(validators.classes.hasError);
        nextDOM[0].innerHTML = validators.clean.errorMsg;
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
export function handleFormValidate(e, log) {
    let isPrintLogs = log || false,
    target = e.target,
    checkStatus = false,
    checkFormStatus = false,
    isNeedFormValidate = undefined,
    allFormInputs = undefined,
    isRequire = '',
    validator = '',
    customValidator = '';
    target.noValidate = true;          // Отключить браузерную валидацию для формы

    if ( target.tagName === 'FORM' ) {
        isNeedFormValidate = target.getAttribute('data-js-validation');
        // Проверка формы на, то требует ли фолрма валидации с помощью mmJSValadation
        if ( isNeedFormValidate === 'true' ) {
            allFormInputs = target.getElementsByTagName('input');

            // Проверка на наличие инпуитов в форме
            if ( allFormInputs.length !== 0 ) {
                // Проверка всех полей в единственном цикле
                for (let i=0;i<allFormInputs.length;i++) {
                    isRequire = allFormInputs[i].getAttribute('data-validation-require');
                    validator = allFormInputs[i].getAttribute('data-validation-templ');
                    customValidator = allFormInputs[i].getAttribute('data-validation-custom');

                    // Проверка обязательных полей
                    if ( isRequire === 'true' ) {
                        checkStatus = checkInputForRequire( allFormInputs[i] );
                        checkFormStatus = checkStatus;       // если поле пустое, то FALSE, иначе TRUE
                        setValidateStatusInDOM( checkStatus, allFormInputs[i], validators.requireField.errorMsg );

                        if ( checkStatus ) {
                            if ( validator ) {
                                checkStatus = checkInputTemplRegular( validator, allFormInputs[i] )
                                checkFormStatus = checkStatus;
                                setValidateStatusInDOM( checkStatus, allFormInputs[i], validators[validator].errorMsg );
                            } else if ( customValidator ) {
                                let customValidatorArray = customValidator.split(';');
                                let validator = 'customValidator';

                                // уберем кавычки из начала и конца строки
                                for (let i=0;i<customValidatorArray.length;i++) {
                                    customValidatorArray[i] = customValidatorArray[i].slice(1, -1);
                                }

                                // наполним объект кастомной строкой для валидации
                                validators.customValidator.regExprPattern = customValidatorArray[0];
                                validators.customValidator.regExprFlags = customValidatorArray[1];
                                validators.customValidator.errorMsg = customValidatorArray[2];

                                checkStatus = checkInputTemplRegular( validator, allFormInputs[i] )
                                checkFormStatus = checkStatus;
                                setValidateStatusInDOM( checkStatus, allFormInputs[i], validators[validator].errorMsg );

                                // почистим объект кастомного валидатора
                                validators.customValidator.regExprPattern = '';
                                validators.customValidator.regExprFlags = '';
                                validators.customValidator.errorMsg = '';
                            }
                        }
                    } // Проверка обязательных полей
                    // Проверка необязательных полей
                    else {
                        if ( validator && allFormInputs[i].value ) {
                            checkStatus = checkInputTemplRegular( validator, allFormInputs[i] )
                            checkFormStatus = checkStatus;
                            setValidateStatusInDOM( checkStatus, allFormInputs[i], validators[validator].errorMsg );
                        } else if ( customValidator && allFormInputs[i].value ) {
                            let customValidatorArray = customValidator.split(';');
                            let validator = 'customValidator';

                            // уберем кавычки из начала и конца строки
                            for (let i=0;i<customValidatorArray.length;i++) {
                                customValidatorArray[i] = customValidatorArray[i].slice(1, -1);
                            }

                            // наполним объект кастомной строкой для валидации
                            validators.customValidator.regExprPattern = customValidatorArray[0];
                            validators.customValidator.regExprFlags = customValidatorArray[1];
                            validators.customValidator.errorMsg = customValidatorArray[2];

                            checkStatus = checkInputTemplRegular( validator, allFormInputs[i] )
                            checkFormStatus = checkStatus;
                            setValidateStatusInDOM( checkStatus, allFormInputs[i], validators[validator].errorMsg );

                            // почистим объект кастомного валидатора
                            validators.customValidator.regExprPattern = '';
                            validators.customValidator.regExprFlags = '';
                            validators.customValidator.errorMsg = '';
                        }
                    } // Проверка необязательных полей
                }  // окончание проверки всех полей

                // Если в инпутах формы есть ошибки, то форму не отправлять
                if ( !checkFormStatus ) {
                    if(isPrintLogs) console.log('В инпутах есть ошибка. Форма не отправлена');
                    e.preventDefault();
                } else {
                    if(isPrintLogs) console.log('Ошибок нет. Форма отправлена!');
                } //Если в инпутах формы есть ошибки, то форму не отправлять

            } // Проверка на наличие инпуитов в форме
            // Если инпутов нет, то завершить обработку и выйти
            else {
                e.preventDefault();
                return;
            } // Если инпутов нет, то завершить обработку и выйти
        } // Проверка формы на, то требует ли фолрма валидации с помощью mmJSValadation
        // Если форма не требует валидации с помощью mmJSValadation, то просто отдать ее BACK-END
        else {
            if(isPrintLogs) console.log('Форма поехала в бекэнд');
        }         // Если форма не требует валидации с помощью mmJSValadation, то просто отдать ее BACK-END
    }

}; // handleFormValidate
// Обработчики событий =========================================================