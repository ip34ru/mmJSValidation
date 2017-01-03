var Router = {
    handle: function(route) {
        var routeName = route + 'Route';

        Controller[routeName]();
    }
};
