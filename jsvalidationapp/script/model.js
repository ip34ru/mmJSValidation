var Model = {
    login: function(appId, perms) {
        return new Promise(function(resolve, reject) {
            VK.init({
                apiId: appId
            });

            VK.Auth.login(function(response) {
                if (response.session) {
                    resolve(response);
                } else {
                    reject(new Error('Не удалось авторизоваться'));
                }
            }, perms);
        });
    },
    callApi: function(method, params) {
        return new Promise(function(resolve, reject) {
            VK.api(method, params, function(response) {
                if (response.error) {
                    reject(new Error(response.error.error_msg));
                } else {
                    resolve(response.response);
                }
            });
        });
    },
    getUser: function() {
        return this.callApi('users.get', {});
    },
    getMusic: function() {
        return this.callApi('audio.get', {});
    },
    getFriends: function() {
        return this.callApi('friends.get', { fields: 'photo_100' });
    },
    getGroups: function() {
        return this.callApi('groups.get', { v: settingsVK.apiVersion, extended:1 });
    },
    getPhotos: function() {
        return this.callApi('photos.get', { v: settingsVK.apiVersion, extended:1, album_id:'wall' });
    },
    getPhotosComments: function( ownerID, photosID ) {
        return this.callApi('photos.getComments', {
            v: settingsVK.apiVersion,
            extended:1,
            owner_id: ownerID,
            photo_id: photosID
        });
    },
    getNews: function() {
        return this.callApi('newsfeed.get', { filters: 'post', count: 20 });
    }
};
