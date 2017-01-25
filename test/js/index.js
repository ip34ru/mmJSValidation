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
        if ( !inputDOM.value.trim() ) {
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
        let nextDOM = parentDOM.getElementsByTagName('span');
        if ( isErrorInInput === false ) {
            parentDOM.classList.add(test$src$mm$form$validation0$module$$validators.classes.hasError);
            nextDOM[0].innerHTML = validatorErrorMsg;             //берем самый первый span внутри родителя
        } else {
            parentDOM.classList.remove(test$src$mm$form$validation0$module$$validators.classes.hasError);
            nextDOM[0].innerHTML = test$src$mm$form$validation0$module$$validators.clean.errorMsg;
        }
        return;
    }

    // Объединение нескольких коллекций элементов в один массив
    /**
     * Объединение нескольких коллекций элементов в один массив
     * @param  {DOM}                target        DOM элемент в котором нужно искать требуемые элементы
     * @param  {HTMLCollection}     tempArray     строковый массив с указанием тегов
     * @return {array}              resultArray   результирующий массив объединенных коллекций элементов
     */
    // concatTagNamesCollectionToArray
    function test$src$mm$form$validation0$module$$concatTagNamesCollectionToArray(target, tempArray){
        let resultArray = [];
        let targetDOM = target;
        let tempHTMLCollection = null;
        for(let a=0; a<tempArray.length; a++) {
            tempHTMLCollection = targetDOM.getElementsByTagName(tempArray[a]);
            for(let i=0; i<tempHTMLCollection.length; i++) {
                resultArray.push(tempHTMLCollection[i]);
            }
        }
        return resultArray;
    }
    function test$src$mm$form$validation0$module$$handleFormValidate(e, log) {
        e.preventDefault();
        let isPrintLogs = log || false,
        target = e.target,
        checkStatus = false,
        checkFormStatus = false,
        isNeedFormValidate = undefined,
        // allFormInputs = undefined,
        // allFormTextAreas = undefined,
        allFormElements = undefined,
        isRequire = '',
        validator = '',
        customValidator = '';
        target.noValidate = true;          // Отключить браузерную валидацию для формы
    
        if ( target.tagName === 'FORM' ) {
            isNeedFormValidate = target.getAttribute('data-js-validation');
            // Проверка формы на, то требует ли фолрма валидации с помощью mmJSValadation
            if ( isNeedFormValidate === 'true' ) {
                allFormElements = test$src$mm$form$validation0$module$$concatTagNamesCollectionToArray(target, ['input', 'textarea'] );        // можно задавать список различных тегов для объединения в единую HTML клоллекцию
    
                // allFormInputs = target.getElementsByTagName('input');
                // allFormTextAreas = target.getElementsByTagName('textarea');
                // // сконкатим TEXTAREA к массиву allFormElements
                // allFormElements = Object.assign( allFormInputs, allFormTextAreas );
                // console.log( allFormInputs );
                // console.log( allFormTextAreas );
                console.log( allFormElements );
    
                // Проверка на наличие инпуитов в форме
                if ( allFormElements.length !== 0 ) {
                    // Проверка всех полей в единственном цикле
                    for (let i=0;i<allFormElements.length;i++) {
                        isRequire = allFormElements[i].getAttribute('data-validation-require');
                        validator = allFormElements[i].getAttribute('data-validation-templ');
                        customValidator = allFormElements[i].getAttribute('data-validation-custom');
    
                        // Проверка обязательных полей
                        if ( isRequire === 'true' ) {
                            checkStatus = test$src$mm$form$validation0$module$$checkInputForRequire( allFormElements[i] );
                            checkFormStatus = checkStatus;       // если поле пустое, то FALSE, иначе TRUE
                            test$src$mm$form$validation0$module$$setValidateStatusInDOM( checkStatus, allFormElements[i], test$src$mm$form$validation0$module$$validators.requireField.errorMsg );
    
                            if ( checkStatus ) {
                                if ( validator ) {
                                    checkStatus = test$src$mm$form$validation0$module$$checkInputTemplRegular( validator, allFormElements[i] )
                                    checkFormStatus = checkStatus;
                                    test$src$mm$form$validation0$module$$setValidateStatusInDOM( checkStatus, allFormElements[i], test$src$mm$form$validation0$module$$validators[validator].errorMsg );
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
    
                                    checkStatus = test$src$mm$form$validation0$module$$checkInputTemplRegular( validator, allFormElements[i] )
                                    checkFormStatus = checkStatus;
                                    test$src$mm$form$validation0$module$$setValidateStatusInDOM( checkStatus, allFormElements[i], test$src$mm$form$validation0$module$$validators[validator].errorMsg );
    
                                    // почистим объект кастомного валидатора
                                    test$src$mm$form$validation0$module$$validators.customValidator.regExprPattern = '';
                                    test$src$mm$form$validation0$module$$validators.customValidator.regExprFlags = '';
                                    test$src$mm$form$validation0$module$$validators.customValidator.errorMsg = '';
                                }
                            }
                        } // Проверка обязательных полей
                        // Проверка необязательных полей
                        else {
                            if ( validator && allFormElements[i].value ) {
                                checkStatus = test$src$mm$form$validation0$module$$checkInputTemplRegular( validator, allFormElements[i] )
                                checkFormStatus = checkStatus;
                                test$src$mm$form$validation0$module$$setValidateStatusInDOM( checkStatus, allFormElements[i], test$src$mm$form$validation0$module$$validators[validator].errorMsg );
                            } else if ( customValidator && allFormElements[i].value ) {
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
    
                                checkStatus = test$src$mm$form$validation0$module$$checkInputTemplRegular( validator, allFormElements[i] )
                                checkFormStatus = checkStatus;
                                test$src$mm$form$validation0$module$$setValidateStatusInDOM( checkStatus, allFormElements[i], test$src$mm$form$validation0$module$$validators[validator].errorMsg );
    
                                // почистим объект кастомного валидатора
                                test$src$mm$form$validation0$module$$validators.customValidator.regExprPattern = '';
                                test$src$mm$form$validation0$module$$validators.customValidator.regExprFlags = '';
                                test$src$mm$form$validation0$module$$validators.customValidator.errorMsg = '';
                            }
                        } // Проверка необязательных полей
                    }  // окончание проверки всех полей
    
                    // Если в инпутах формы есть ошибки, то форму не отправлять
                    if ( !checkFormStatus ) {
                        if(isPrintLogs) console.log('В инпутах есть ошибка. Форма не отправлена');
                        e.preventDefault();
                    } else {
                        if(isPrintLogs) console.log('Ошибок нет. Форма отправлена!');
                        e.preventDefault();
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
                e.preventDefault();
            }         // Если форма не требует валидации с помощью mmJSValadation, то просто отдать ее BACK-END
        }
    
    }'use strict';

    let test$src$index$$validateInArticlesExample = document.getElementById('validateThisID');

    // события на DOM элементах ====================================================
    // событие сабмит формы
    test$src$index$$validateInArticlesExample.addEventListener('submit', (e) => { test$src$mm$form$validation0$module$$handleFormValidate(e); } );
}).call(this);

//# sourceMappingURL=index.js.map