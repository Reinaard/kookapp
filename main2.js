var app = angular.module('app', ['firebase']);
var fb = new Firebase('https://kookapp-22c31.firebaseio.com/data');

app.controller('kookController', function ($scope, $firebaseArray, GerechtArray) {
    $scope.dishes =  GerechtArray.all;

    $scope.addGerecht = function(gerecht){
        Gerecht.create(gerecht);
    };

    $scope.ingredients = GerechtArray(fb.child('ingredienten'));
});

app.factory('GerechtArray', function ($firebaseObject) {
    return function (ref) {
        var gerechten = fb.child('gerechten').$asArray();
        var ingredienten = fb.child('ingredienten').$asArray();

        var Gerecht = {
            all: dishes,
            create: function (gerecht) {
                return dishes.$add(gerecht);
            },
            get: function (gerechtId) {
                return $firebaseObject(ref.child('gerechten').child(gerechtId)).$asObject();
            },
            delete: function (gerecht) {
                return gerechten.$remove(gerecht);
            }
        };

        return Gerecht;
    }



});