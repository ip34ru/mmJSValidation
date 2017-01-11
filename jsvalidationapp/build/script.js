(function() {
    "use strict";
    'use strict';

    // установочные переменые ======================================================
    let $$$lib$mm$form$validation$module$$validators = {
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
    function $$$lib$mm$form$validation$module$$checkInputForRequire( inputDOM ) {
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
    function $$$lib$mm$form$validation$module$$checkInputTemplRegular( validatorStr, inputDOM ) {
        let validObj = $$$lib$mm$form$validation$module$$validators[validatorStr];
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
    function $$$lib$mm$form$validation$module$$setValidateStatusInDOM( isErrorInInput, inputDOM, validatorErrorMsg ) {
        let parentDOM = inputDOM.parentElement;
        let nextDOM = inputDOM.nextElementSibling;
        if ( isErrorInInput === false ) {
            parentDOM.classList.add($$$lib$mm$form$validation$module$$validators.classes.hasError);
            nextDOM.innerHTML = validatorErrorMsg;
        } else {
            parentDOM.classList.remove($$$lib$mm$form$validation$module$$validators.classes.hasError);
            nextDOM.innerHTML = $$$lib$mm$form$validation$module$$validators.clean.errorMsg;
        }
        return;
    }function $$$lib$mm$form$validation$module$$handleFormValidate(e) {
        let target = e.target;
        let checkStatus = false;
        let checkFormStatus = false;
        let isNeedFormValidate = undefined;
        let allFormInputs = undefined;
        let isRequire = '';
        let validator = '';
        let customValidator = '';
        target.noValidate = true;          // Отключить браузерную валидацию для формы
    
        if ( target.tagName === 'FORM' ) {
            isNeedFormValidate = target.getAttribute('data-js-validation');
            if ( isNeedFormValidate === 'true' ) {
                allFormInputs = target.getElementsByTagName('input');
    
                if ( allFormInputs.length !== 0 ) {
                    // проверка на ОБЯЗАТЕЛЬНОСТЬ полей
                    for (let i=0;i<allFormInputs.length;i++) {
                        isRequire = allFormInputs[i].getAttribute('data-validation-require');
                        if ( isRequire === 'true' ) {
                            checkStatus = $$$lib$mm$form$validation$module$$checkInputForRequire( allFormInputs[i] );
                            checkFormStatus = checkStatus;
                            $$$lib$mm$form$validation$module$$setValidateStatusInDOM( checkStatus, allFormInputs[i], $$$lib$mm$form$validation$module$$validators.requireField.errorMsg );
                        }
                    }  // окончание проверки на ОБЯЗАТЕЛЬНОСТЬ полей
    
                    // проверка полей на соответсвие вводимых значений
                    if ( checkFormStatus ) {
                        for (let i=0;i<allFormInputs.length;i++) {
                            validator = allFormInputs[i].getAttribute('data-validation-templ');
                            customValidator = allFormInputs[i].getAttribute('data-validation-custom');
    
                            if ( validator ) {
                                checkStatus = $$$lib$mm$form$validation$module$$checkInputTemplRegular( validator, allFormInputs[i] )
                                checkFormStatus = checkStatus;
                                $$$lib$mm$form$validation$module$$setValidateStatusInDOM( checkStatus, allFormInputs[i], $$$lib$mm$form$validation$module$$validators[validator].errorMsg );
                            } else if ( customValidator ) {
                                // TODO вызывать функцию для проверки кастомной регулярки
                            }
    
                        }
                    } // окончание проверки полей на соответсвие вводимых значений
    
                    // Если в инпутах формы есть ошибки, то форму не отправлять
                    if ( !checkFormStatus ) {
                        console.log('В инпутах есть ошибка. Форма не отправлена');
                        e.preventDefault();
                    } else {
                        console.log('Ошибок нет. Форма отправлена!');
                        e.preventDefault();
                    }
    
                } else {
                    e.preventDefault();
                    return;
                }
            } else {
                // TODO здесь отдавать в BACK-END, убрать preventDefault
                console.log('Форма поехала АЯКСОМ в бекэнд');
                e.preventDefault();
            }
        }
    
    
    }'use strict';

    let jsvalidationapp$script$script$$validateInArticlesExample = document.getElementById('validateThisID');

    // события на DOM элементах ====================================================
    // событие сабмит формы
    jsvalidationapp$script$script$$validateInArticlesExample.addEventListener('submit', (e) => { $$$lib$mm$form$validation$module$$handleFormValidate(e); } );
}).call(this);

//# sourceMappingURL=script.js.map