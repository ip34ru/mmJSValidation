// ДЗ 2: Создать приложение для ВКонтакте, которое загружает список ваших
// друзей и выводит их на страницу в следующем формате:
// Фото, ФИО, Возраст, Дата рождения.
// Друзья должны быть отсортированы по дате рождения в порядке убывания.
// То есть на самом верху списка расположен друг с ближайший датой рождения.
// Использование шаблонизатора приветствуется.
// =============================================================================

// =============================================================================
// VK AppID = 5757533
// =============================================================================

// =============================================================================
// Установка HTTP-сервера:
// 1) npm install http-server -g
// Запуск HTTP-сервера:
// 2) http-server hm2 -p 7777 -a 127.0.0.1
// 3) http://localhost:7777/
// =============================================================================

let vkAppId = 5757533;
let headerUserFriendsVK = document.getElementById('headerUserFriendsVK');
let listOfDownloadedFriends = document.getElementById('listOfDownloadedFriends');
let allRenderedFriends = document.getElementById('allRenderedFriends');
let VK_ACCESS_FRIENDS = 2;

// вспомогательные функции======================================================
// функция сравнения возраста
function compareAge(personA, personB) {
    let friendA = new Date(personA.bdate.replace(/(\d+)\.(\d+)\.(\d+)/, '$2/$1/$3'));
    let friendB = new Date(personB.bdate.replace(/(\d+)\.(\d+)\.(\d+)/, '$2/$1/$3'));
    friendA = Date.parse(friendA);
    friendB = Date.parse(friendB);
    return friendB - friendA;       // здесь можно поменять порядок сортировки, поменяв слагаемые
} // compareAge
// вспомогательные функции======================================================


new Promise(function(resolve) {
        if (document.readyState === 'complete') {
            resolve();
        } else {
            window.onload = resolve;
        }
    })
    // запрос авторизации в ВК
    .then(function() {
        return new Promise(function(resolve, reject) {
            VK.init({
                apiId: vkAppId
            });

            VK.Auth.login(function(response) {
                if (response.session) {
                    resolve(response);
                } else {
                    reject(new Error('Не удалось авторизоваться'));
                }
            }, VK_ACCESS_FRIENDS);
        });
    })
    // получение полного имени пользователя
    .then(function() {
        return new Promise(function(resolve, reject) {
            VK.api('users.get', {'name_case': 'gen'}, function(response) {
                if (response.error) {
                    reject(new Error(response.error.error_msg));
                } else {
                    headerUserFriendsVK.textContent = `Друзья ${response.response[0].first_name} ${response.response[0].last_name}`;
                    resolve();
                }
            });
        })
    })
    // получение id всех друзей пользователя
    .then(function() {
        return new Promise(function(resolve, reject) {
            VK.api('friends.get', {v: '5.8'}, function(serverAnswer) {
                if (serverAnswer.error) {
                    reject(new Error(serverAnswer.error.error_msg));
                } else {
                    resolve(serverAnswer);
                }
            });
        });
    })
    // получение данных всех ранее полученных друзей, обработка дат рождения, вывод в DOM
    .then( function(serverAnswer) {
        return new Promise(
            function(resolve, reject) {
                VK.api(
                    'users.get',
                    {
                        v: '5.8',
                        user_ids: serverAnswer.response.items,
                        fields: 'bdate,photo_50,friend_status'
                    },
                    function(serverAnswer) {
                        if (serverAnswer.error) {
                            reject(new Error(serverAnswer.error.error_msg));
                        } else {
                            console.log('serverAnswer.response = ', serverAnswer.response);
                            // в промежуточный массив брать только тех кто указал дату рождения полностью
                            let tempArrOfFriendsObj = [];
                            for (let i = 0; i < serverAnswer.response.length; i++) {
                                if ( serverAnswer.response[i].bdate && typeof serverAnswer.response[i].bdate !== 'undefined' ) {
                                    if (serverAnswer.response[i].bdate.match(/\.\d{4}/i)) {
                                        let tempLength = tempArrOfFriendsObj.length;
                                        tempArrOfFriendsObj[tempLength] = serverAnswer.response[i];
                                    }
                                }
                            }
                            // вызов функции сортировки по возрасту
                            tempArrOfFriendsObj.sort(compareAge);
                            // вывод данных о друзьях в DOM
                            let source = allRenderedFriends.innerHTML;
                            let templateFn = Handlebars.compile(source);
                            let template = templateFn({ friendslist: tempArrOfFriendsObj });
                            listOfDownloadedFriends.innerHTML = template;
                            resolve();
                        }
                });
            }
        );
    })
    .catch(function(e) {
        alert(`Ошибка: ${e.message}`);
    });
