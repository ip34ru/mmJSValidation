'use strict';



// TODO вынести в отдельную функцию код добавления(удаления) сообщения
// при валидации полей формы

let form1 = document.getElementById('form1');
let form2 = document.getElementById('form2');
let form1SubmitBtn = document.getElementById('form1SubmitBtn');
let form2SubmitBtn = document.getElementById('form2SubmitBtn');










// события на DOM элементах ====================================================
// событие клик на кнопке "крестик"(перемещение справа-на-лево) в левой и правых стронах
form1SubmitBtn.addEventListener('click', (e) => { handleFormValidate(e, form1); } );
form2SubmitBtn.addEventListener('click', (e) => { handleFormValidate(e, form2); } );
// события на DOM элементах ====================================================
