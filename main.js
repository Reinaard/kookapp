var app =  angular.module('kookApp', ['firebase']);

app.controller('kookController', ['$scope','Gerecht','Ingredient', function($scope, Gerecht, Ingredient){

	$scope.gerechten = Gerecht.all;
	$scope.ingredienten = Ingredient.all;

	$scope.selected = [];

	var result = [
		{
			"ingredienten": ["Aardappels", "Boontjes", "Kip"],
			"name": "Roti"
		},
		{
			"ingredienten": ["Gehakt", "Kruiden", "Koeken"],
			"name": "Wraps"
		}
	];
	$scope.gerechtenWithIngredienten = function(gerechten) {

		console.log(gerechten);
		return result;
	};

	$scope.toggle = function (ingredient) {
		var idx = $scope.selected.indexOf(ingredient);
		if (idx > -1) {
			$scope.selected.splice(idx, 1);
		}
		else {
			$scope.selected.push(ingredient);
		}
	};

	$scope.addIngredient = function (item) {
		var exists = false;
		var ref = new Firebase("https://kookapp-22c31.firebaseio.com/data/ingredienten");
		ref.once("value", function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
				var val = childSnapshot.val();
				if(val.toLowerCase() == item.toLowerCase()) {
					exists = true
				}
			});
		});
		if(!exists) {
			Ingredient.create(item);
		}
	};

	$scope.addGerecht = function(nieuwGerecht){
		nieuwGerecht.ingredienten = [];
		for(var i = 0; i < $scope.selected.length; i++) {
			nieuwGerecht.ingredienten.push($scope.selected[i].$id);
		}
		Gerecht.create(nieuwGerecht);

		$scope.selected = [];
		$scope.nieuwGerecht.ingredienten = [];
		$scope.nieuwGerecht.name = null;
	};

}]);

app.factory('Gerecht', ['$firebase',
	function($firebase) {
		var ref = new Firebase('https://kookapp-22c31.firebaseio.com/data');
		var gerechten = $firebase(ref.child('gerechten')).$asArray();

		var Gerecht = {
			all: gerechten,
			create: function (nieuwgerecht) {
				return gerechten.$add(nieuwgerecht);
			},
			get: function (gerechtId) {
				return $firebase(ref.child('gerechten').child(gerechtId)).$asObject();
			},
			delete: function (gerecht) {
				return gerechten.$remove(gerecht);
			}
		};

		return Gerecht;
	}
]);

app.factory('Ingredient', ['$firebase',
	function($firebase) {
		var ref = new Firebase('https://kookapp-22c31.firebaseio.com/data');
		var ingredienten = $firebase(ref.child('ingredienten')).$asArray();

		var Ingredient = {
			all: ingredienten,
			create: function (ingredient) {
				return ingredienten.$add(ingredient);
			},
			get: function (ingredientId) {
				return $firebase(ref.child('ingredienten').child(ingredientId)).$asObject();
			},
			delete: function (ingredient) {
				return ingredienten.$remove(ingredient);
			}
		};

		return Ingredient;

	}
]);