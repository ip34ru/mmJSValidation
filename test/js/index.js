(function() {
    "use strict";
    'use strict';

    // установочные переменые ======================================================
    let test$src$mm$form$validation0$module$$validators = {
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
    function test$src$mm$form$validation0$module$$checkInputForRequire( inputDOM ) {
        if ( !inputDOM.value ) {
            return false;
        }
        return true;
    }

    // Функция сравнивающая данные в поле с предустановленной регуляркой
    /**
    * [checkInputTemplRegular проверка на соответсвие данных введенных в поле
    * на соответсвие регулярному выражению
    * @param  {string} validatorStr      тип валидируемого шаблона, указанный для поля (пример: email, phone и т.д.)
    * @param  {DOM Element} inputDOM     DOM элемент, input из валидируемой формы
    * @return {boolean}                  если строка в поле совпадает с регуляркой, то true
    *                                    иначе false
    */
    function test$src$mm$form$validation0$module$$checkInputTemplRegular( validatorStr, inputDOM ) {
        let validObj = test$src$mm$form$validation0$module$$validators[validatorStr];
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
    
    }

    // функция для вывода сообщения об ошибке и выделении инпута в цвет ошибки (например красный)
    // TODO предусмотреть задание классов для отвалидированного поля, например зелененьким;)
    /**
     * setValidateStatusInDOM сообщение об ошибке, если поле не прошло валидацию
     * @param {Boolean} isErrorInInput    есть ошибка в input формы или нет
     * @param {DOM Element}  inputDOM     DOM элемент, input из валидируемой формы
     * @param {string}  validatorErrorMsg сообщение об ошибке
     */
    function test$src$mm$form$validation0$module$$setValidateStatusInDOM( isErrorInInput, inputDOM, validatorErrorMsg ) {
        let parentDOM = inputDOM.parentElement;
        // let nextDOM = inputDOM.nextElementSibling;             //OLD!!!
        let nextDOM = parentDOM.getElementsByTagName('span');
        if ( isErrorInInput === false ) {
            parentDOM.classList.add(test$src$mm$form$validation0$module$$validators.classes.hasError);
            nextDOM[0].innerHTML = validatorErrorMsg;             //ищем самый первый span внутри родителя
        } else {
            parentDOM.classList.remove(test$src$mm$form$validation0$module$$validators.classes.hasError);
            nextDOM[0].innerHTML = test$src$mm$form$validation0$module$$validators.clean.errorMsg;
        }
        return;
    }function test$src$mm$form$validation0$module$$handleFormValidate(e, log) {
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
            if ( isNeedFormValidate === 'true' ) {
                allFormInputs = target.getElementsByTagName('input');
    
                if ( allFormInputs.length !== 0 ) {
                    // Проверка всех полей в единственном цикле
                    for (let i=0;i<allFormInputs.length;i++) {
                        isRequire = allFormInputs[i].getAttribute('data-validation-require');
                        validator = allFormInputs[i].getAttribute('data-validation-templ');
                        customValidator = allFormInputs[i].getAttribute('data-validation-custom');
    
    
                        // if ( allFormInputs[i].value ) {
                        //     console.log('input ' + i + ' =', allFormInputs[i].value);
                        //     console.log('type of input ' + i + ' =', typeof allFormInputs[i].value);
                        //
                        // } else {
                        //     console.log('type of input ' + i + ' =', typeof allFormInputs[i].value);
                        //
                        // }
    
                        // isRequire === 'true'
                        if ( isRequire === 'true' ) {
                            checkStatus = test$src$mm$form$validation0$module$$checkInputForRequire( allFormInputs[i] );
                            checkFormStatus = checkStatus;       // если поле пустое, то FALSE, иначе TRUE
                            test$src$mm$form$validation0$module$$setValidateStatusInDOM( checkStatus, allFormInputs[i], test$src$mm$form$validation0$module$$validators.requireField.errorMsg );
    
                            if ( checkStatus ) {
                                // for (let i=0;i<allFormInputs.length;i++) {
                                // validator = allFormInputs[i].getAttribute('data-validation-templ');
                                // customValidator = allFormInputs[i].getAttribute('data-validation-custom');
    
                                if ( validator ) {
                                    checkStatus = test$src$mm$form$validation0$module$$checkInputTemplRegular( validator, allFormInputs[i] )
                                    checkFormStatus = checkStatus;
                                    test$src$mm$form$validation0$module$$setValidateStatusInDOM( checkStatus, allFormInputs[i], test$src$mm$form$validation0$module$$validators[validator].errorMsg );
                                } else if ( customValidator ) {
                                    let customValidatorArray = customValidator.split(';');
                                    let validator = 'customValidator';
    
                                    // уберем кавычки из начала и конца строки
                                    for (let i=0;i<customValidatorArray.length;i++) {
                                        customValidatorArray[i] = customValidatorArray[i].slice(1, -1);
                                    }
    
                                    // наполним объект кастомной строкой для валидации
                                    test$src$mm$form$validation0$module$$validators.customValidator.regExprPattern = customValidatorArray[0];
                                    test$src$mm$form$validation0$module$$validators.customValidator.regExprFlags = customValidatorArray[1];
                                    test$src$mm$form$validation0$module$$validators.customValidator.errorMsg = customValidatorArray[2];
    
                                    console.log(test$src$mm$form$validation0$module$$validators);
    
                                    checkStatus = test$src$mm$form$validation0$module$$checkInputTemplRegular( validator, allFormInputs[i] )
                                    checkFormStatus = checkStatus;
                                    test$src$mm$form$validation0$module$$setValidateStatusInDOM( checkStatus, allFormInputs[i], test$src$mm$form$validation0$module$$validators[validator].errorMsg );
    
                                    // почистим объект кастомного валидатора
                                    test$src$mm$form$validation0$module$$validators.customValidator.regExprPattern = '';
                                    test$src$mm$form$validation0$module$$validators.customValidator.regExprFlags = '';
                                    test$src$mm$form$validation0$module$$validators.customValidator.errorMsg = '';
    
                                    console.log(test$src$mm$form$validation0$module$$validators);
                                }
    
                                // }
                            }
                        } // isRequire === 'true'
                        else {
    
                            if ( validator && allFormInputs[i].value ) {
                                checkStatus = test$src$mm$form$validation0$module$$checkInputTemplRegular( validator, allFormInputs[i] )
                                checkFormStatus = checkStatus;
                                test$src$mm$form$validation0$module$$setValidateStatusInDOM( checkStatus, allFormInputs[i], test$src$mm$form$validation0$module$$validators[validator].errorMsg );
                            } else if ( customValidator && allFormInputs[i].value ) {
                                let customValidatorArray = customValidator.split(';');
                                let validator = 'customValidator';
    
                                // уберем кавычки из начала и конца строки
                                for (let i=0;i<customValidatorArray.length;i++) {
                                    customValidatorArray[i] = customValidatorArray[i].slice(1, -1);
                                }
    
                                // наполним объект кастомной строкой для валидации
                                test$src$mm$form$validation0$module$$validators.customValidator.regExprPattern = customValidatorArray[0];
                                test$src$mm$form$validation0$module$$validators.customValidator.regExprFlags = customValidatorArray[1];
                                test$src$mm$form$validation0$module$$validators.customValidator.errorMsg = customValidatorArray[2];
    
                                console.log(test$src$mm$form$validation0$module$$validators);
    
                                checkStatus = test$src$mm$form$validation0$module$$checkInputTemplRegular( validator, allFormInputs[i] )
                                checkFormStatus = checkStatus;
                                test$src$mm$form$validation0$module$$setValidateStatusInDOM( checkStatus, allFormInputs[i], test$src$mm$form$validation0$module$$validators[validator].errorMsg );
    
                                // почистим объект кастомного валидатора
                                test$src$mm$form$validation0$module$$validators.customValidator.regExprPattern = '';
                                test$src$mm$form$validation0$module$$validators.customValidator.regExprFlags = '';
                                test$src$mm$form$validation0$module$$validators.customValidator.errorMsg = '';
    
                                console.log(test$src$mm$form$validation0$module$$validators);
                            }
    
    
                        } // isRequire !== 'true'
    
    
                    }  // окончание проверки
    
                    // // проверка на ОБЯЗАТЕЛЬНОСТЬ полей
                    // for (let i=0;i<allFormInputs.length;i++) {
                    //     isRequire = allFormInputs[i].getAttribute('data-validation-require');
                    //     if ( isRequire === 'true' ) {
                    //         checkStatus = checkInputForRequire( allFormInputs[i] );
                    //         checkFormStatus = checkStatus;
                    //         setValidateStatusInDOM( checkStatus, allFormInputs[i], validators.requireField.errorMsg );
                    //     }
                    // }  // окончание проверки на ОБЯЗАТЕЛЬНОСТЬ полей
                    //
                    // // проверка полей на соответсвие вводимых значений
                    // if ( checkFormStatus ) {
                    //     for (let i=0;i<allFormInputs.length;i++) {
                    //         validator = allFormInputs[i].getAttribute('data-validation-templ');
                    //         customValidator = allFormInputs[i].getAttribute('data-validation-custom');
                    //
                    //         if ( validator ) {
                    //             checkStatus = checkInputTemplRegular( validator, allFormInputs[i] )
                    //             checkFormStatus = checkStatus;
                    //             setValidateStatusInDOM( checkStatus, allFormInputs[i], validators[validator].errorMsg );
                    //         } else if ( customValidator ) {
                    //             let customValidatorArray = customValidator.split(';');
                    //             let validator = 'customValidator';
                    //
                    //             // уберрем кавычки из начала и конца строки
                    //             for (let i=0;i<customValidatorArray.length;i++) {
                    //                 customValidatorArray[i] = customValidatorArray[i].slice(1, -1);
                    //             }
                    //
                    //             // наполним объект кастомной строкой для валидации
                    //             validators.customValidator.regExprPattern = customValidatorArray[0];
                    //             validators.customValidator.regExprFlags = customValidatorArray[1];
                    //             validators.customValidator.errorMsg = customValidatorArray[2];
                    //
                    //             console.log(validators);
                    //
                    //             checkStatus = checkInputTemplRegular( validator, allFormInputs[i] )
                    //             checkFormStatus = checkStatus;
                    //             setValidateStatusInDOM( checkStatus, allFormInputs[i], validators[validator].errorMsg );
                    //
                    //             // почистим объект кастомного валидатора
                    //             validators.customValidator.regExprPattern = '';
                    //             validators.customValidator.regExprFlags = '';
                    //             validators.customValidator.errorMsg = '';
                    //
                    //             console.log(validators);
                    //         }
                    //
                    //     }
                    // } // окончание проверки полей на соответсвие вводимых значений
    
                    // Если в инпутах формы есть ошибки, то форму не отправлять
                    if ( !checkFormStatus ) {
                        if(isPrintLogs) console.log('В инпутах есть ошибка. Форма не отправлена');
                        e.preventDefault();
                    } else {
                        if(isPrintLogs) console.log('Ошибок нет. Форма отправлена!');
                    }
    
                } else {
                    e.preventDefault();
                    return;
                }
            } else {
                // TODO здесь отдавать в BACK-END, убрать preventDefault
                if(isPrintLogs) console.log('Форма поехала в бекэнд');
    
            }
        }
    
    
    }'use strict';

    let test$src$index$$validateInArticlesExample = document.getElementById('validateThisID');

    // события на DOM элементах ====================================================
    // событие сабмит формы
    test$src$index$$validateInArticlesExample.addEventListener('submit', (e) => { test$src$mm$form$validation0$module$$handleFormValidate(e); } );
}).call(this);

//# sourceMappingURL=index.js.map