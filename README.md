### JS-валидация input полей moremam.ru
====

### v 0.0.2
====

### Описание скрипта
====

#### Скрипт для проверки вводимых значений в полях форм

структура HTML формы
``` html
<div class="form-group">
    <label class="control-label">...</label>
    <input type="email" class="form-control" placeholder="...">
    <span class="help-block"></span>
</div>
```
только в таком виде навешивание стандартных bootstrap классов для валидации
будет подкрашивать элементы формы
структура HTML формы
====

#### Установочные дата-атрибуты в шаблонах HTML

Если форму нужно валидировать, на формие ставим дата атрибут:
```
data-js-validation="true"
```
в случае если нужно быстро отключить валидацию на форме, то можно выставлять значение атрибута равное false

Если поле обязательно для заполнения:
То указываем дата атрибут
```
data-validation-require="true"
```
в случае если нужно быстро отключить проверку на обязательное поле, то ставим
значение атрибута равное false
====

Шаблоны по которым можно валидиролвать:
```
data-validation-templ=
```
указываем различные шаблоны, которые берем из настроечного объекта
@Param validators {object} объект в котором шаблоны со строками в виде регулярных выражений

```
data-validation-custom=""
```
в значении можно указывать кастомную строку следующего формата:
"['regExpr','regExprFlags','errorMsg']"
Данная строка будет преобразовываться в массив
====
