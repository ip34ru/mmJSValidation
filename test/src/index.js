'use strict';

import { handleFormValidate } from '../../src/mm-form-validation0.module';

let validateInArticlesExample = document.getElementById('validateThisID');

// события на DOM элементах ====================================================
// событие сабмит формы
validateInArticlesExample.addEventListener('submit', (e) => { handleFormValidate(e); } );
// события на DOM элементах ====================================================
