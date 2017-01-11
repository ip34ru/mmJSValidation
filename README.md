## JS-валидация input полей moremam.ru
====

### v 1.0.0
====

## Описание скрипта
====

#### Скрипт для проверки вводимых значений в полях форм

#### Структура HTML форм
``` html
<div class="" id="validateThisID">
    <form id="form1" class="" action="" method="">
        <div class="form-group">
            <label class="control-label">...</label>
            <input type="email" class="form-control" placeholder="...">
            <span class="help-block"></span>
        </div>
        <div class="form-group">
            <label class="control-label">...</label>
            <input type="email" class="form-control" placeholder="...">
            <span class="help-block"></span>
        </div>
    </form>

    <form id="form2" class="" action="index.html" method="post">
        <div class="form-group">
            <label class="control-label">...</label>
            <input type="email" class="form-control" placeholder="...">
            <span class="help-block"></span>
        </div>
        <div class="form-group">
            <label class="control-label">...</label>
            <input type="email" class="form-control" placeholder="...">
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
"['regExpr','regExprFlags','errorMsg']"
данная строка будет преобразовываться в массив

====

```data-validation-templ=``` и ```data-validation-custom=""``` не могут использоваться вместе, их можно оставлять в коде только по одному для валидируемого инпута.

====

#### Как собрать ES6-модуль и использовать его для ES5 браузеров?

Используется [ES6 Module Transpiler](https://esnext.github.io/es6-module-transpiler/)

По сути, можно воспользоваться вот этими двумя простыми командами:

```
npm install -g es6-module-transpiler
compile-modules convert -I lib -o jsvalidationapp/build/script.js jsvalidationapp/script/script.js
```

====
