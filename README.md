## JS-валидация input полей moremam.ru
====

### v 1.1.0
====

## Описание скрипта
====

#### Скрипт для проверки вводимых значений в полях форм

#### Структура HTML форм

Внимание! Внутри формы желательно использовать атрибут novalidate

``` html
<div class="container" id="validateThisID">
    <form id="form1" data-js-validation="true" novalidate class="" action="" method="">
        <div class="form-group">
            <label class="control-label">...</label>
            <input type="email" class="form-control" placeholder="..."
            data-validation-require="true"
            data-validation-templ="email"
            >
            <span class="help-block"></span>
        </div>
        <div class="form-group">
            <label class="control-label">...</label>
            <input type="email" class="form-control" placeholder="..."
            data-validation-require="false"
            data-validation-templ="phone"
            >
            <span class="help-block"></span>
        </div>
    </form>

    <form id="form2" data-js-validation="false" novalidate class="" action="index.html" method="post">
        <div class="form-group">
            <label class="control-label">...</label>
            <input type="email" class="form-control" placeholder="..."
            data-validation-require="true"
            data-validation-custom="'.+@.+\..+';'i';'КАСТОМ!!! В поле нужно вводить email, в формате: someaddress@domain.xxx'"
            >
            <span class="help-block"></span>
        </div>
        <div class="form-group">
            <label class="control-label">...</label>
            <input type="email" class="form-control" placeholder="..."
            data-validation-require="true"
            >
            <span class="help-block"></span>
        </div>
    </form>

</div>
```
В таком виде навешивание стандартных bootstrap классов на ```<div class="form-group">``` для валидации будет подкрашивать элементы формы.

В обработчике модуля используется делегирование и события отрабатывают только на форме.

Как должен навешиваться обработчик события:
``` javascript
let submittedForms = document.getElementById('validateThisID');
submittedForms.addEventListener('submit', (e) => { handleFormValidate(e); } );
```

====

#### Установочные дата-атрибуты в шаблонах HTML

Если форму нужно валидировать, на форме ставим дата атрибут:
```
data-js-validation="true"
```
в случае если нужно быстро отключить валидацию на форме, то можно выставлять значение атрибута равное false

Если поле обязательно для заполнения:
То указываем дата атрибут
```
data-validation-require="true"
```
в случае если нужно быстро отключить проверку на обязательное поле, то ставим значение атрибута равное false

====

#### Шаблоны по которым можно валидиролвать:
```
data-validation-templ=
```
указываем различные шаблоны, которые берем из настроечного объекта
@Param validators {object} объект в котором шаблоны со строками в виде регулярных выражений

===

#### Шаблоны для валидирования устанавливаемые самостоятельно внутри data-атрибута

```
data-validation-custom=""
```
в значении можно указывать кастомную строку следующего формата:
```
"'regExpr';'regExprFlags';'errorMsg'"
```
данная строка будет преобразовываться в массив

Пример: ```data-validation-custom="'.+@.+\..+';'i';'В поле нужно вводить email, в формате: someaddress@domain.xxx'"```
Замечание: В ```'regExpr'``` используется один обратный слеш (\), вместо двух (\\)
====

```data-validation-templ=``` и ```data-validation-custom=""``` не могут использоваться вместе, их можно оставлять в коде только по одному для валидируемого инпута.

====

#### Как собрать ES6-модуль и использовать его для ES5 браузеров?

Используется [ES6 Module Transpiler](https://esnext.github.io/es6-module-transpiler/)

По сути, можно воспользоваться вот этими двумя простыми командами:

Для рабочего проекта:
```
$ npm install
$ npm run build
```

Для тестового проекта:
```
$ npm install
$ npm run buildTest
```

====
