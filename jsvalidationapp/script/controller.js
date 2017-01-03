var Controller = {
    musicRoute: function() {
        return Model.getMusic().then(function(music) {
            results.innerHTML = View.render('music', {list: music});
        });
    },
    friendsRoute: function() {
        return Model.getFriends().then(function(friends) {
            results.innerHTML = View.render('friends', {list: friends});
        });
    },
    groupsRoute: function() {
        return Model.getGroups().then(function(groups) {
            results.innerHTML = View.render('groups', {list: groups.items});
        });
    },
    photosRoute: function() {
        Model.getPhotos().then(
            function(photos) {
                // очередь запросов к VK api
                function queueRequests(curr, max) {
                    if (curr >= max) return;
                    Model.getPhotosComments( photos.items[curr].owner_id, photos.items[curr].id )
                    .then(
                        function(comments) {
                            var res = JSON.stringify(comments);
                            var obj = JSON.parse(res);
                            if ( obj.count > 0 ) {
                                photos.items[curr].customComments = obj;
                                for (let i=0; i<photos.items[curr].customComments.items.length; i++) {
                                    //TODO написать функционал выборки и добавления данных автора по его id из профиля в комментарий
                                    console.log('photos '+i, photos.items[curr].customComments.items[i]);
                                }
                            }

                            // рекурсивный вызов и
                            // установка задержки в 1/3 секунды, чтоб ВК не забанил
                            setTimeout(
                                function() { queueRequests(curr+1, max) } , 333
                            );
                        }
                    );

                    //HACK каждый раз перстраиваем dom дерево? 
                    results.innerHTML = View.render('photos', {list: photos.items});

                };
                // queueRequests

                queueRequests(0, photos.items.length);
        })

        ;
    },
    newsRoute: function() {
        return Model.getNews().then(function(news) {
            results.innerHTML = View.render('news', {list: news.items});
        });
    }
};
