'use strict';

import { handleFormValidate } from '../lib/mm-form-validation.module';

let validateInArticlesExample = document.getElementById('validateThisID');

// события на DOM элементах ====================================================
// событие сабмит формы
validateInArticlesExample.addEventListener('submit', (e) => { handleFormValidate(e); } );
// события на DOM элементах ====================================================