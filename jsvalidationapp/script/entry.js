// =============================================================================
// VK AppID = 5757533
// =============================================================================

// =============================================================================
// Установка HTTP-сервера:
// 1) npm install http-server -g
// Запуск HTTP-сервера:
// 2) http-server vkapp -p 7777 -a 127.0.0.1
// 3) http://localhost:7777/
// =============================================================================

// Настроечные параметры
let settingsVK = {
    appID: 5757533,
    apiVersion: '5.60',
    VK_ACCESS_FRIENDS: 2,
    VK_ACCESS_PHOTOS: 4,
    VK_ACCESS_AUDIO: 8,
    VK_ACCESS_WALL: 8192,
    VK_ACCESS_GROUPS: 262144
};

Handlebars.registerHelper('formatTime', function(time) {
    var minutes = parseInt(time / 60),
        seconds = time - minutes * 60;

    minutes = minutes.toString().length === 1 ? '0' + minutes : minutes;
    seconds = seconds.toString().length === 1 ? '0' + seconds : seconds;

    return minutes + ':' + seconds;
});

Handlebars.registerHelper('formatDate', function(ts) {
    return new Date(ts * 1000).toLocaleString();
});

new Promise(function(resolve) {
    window.onload = resolve;
}).then(function() {
    return Model.login(
        settingsVK.appID,
        settingsVK.VK_ACCESS_FRIENDS
        |
        settingsVK.VK_ACCESS_PHOTOS
        |
        settingsVK.VK_ACCESS_AUDIO
        |
        settingsVK.VK_ACCESS_WALL
        |
        settingsVK.VK_ACCESS_GROUPS
    );
}).then(function() {
    return Model.getUser().then(function(users) {
        header.innerHTML = View.render('header', users[0]);
        console.log('USER is', users[0]);
    });
}).catch(function(e) {
    console.error(e);
    alert('Ошибка: ' + e.message);
});
