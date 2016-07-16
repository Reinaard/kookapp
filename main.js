var app =  angular.module('kookApp', ['firebase']);

app.controller('kookController', ['$scope','Gerecht','Ingredient', function($scope, filterFilter, Gerecht, Ingredient){

	$scope.user="Guest";

	$scope.gerechten = Gerecht.all;
	// !! $scope.ingredienten = Ingredient.all; !!
	$scope.ingredienten = [
		{ name: 'kaas' },
		{ name: 'tomaat' },
		{ name: 'gehakt' },
		{ name: 'kruiden' }
	];

	$scope.addedIngredients = {};
	$scope.addedIngredients = $scope.ingredienten;

	console.log($scope.gerechten);
	for(var ingredient in $scope.addedIngredients.name) {
		//ingrediented.selected = false;
		console.log($scope.gerechten);
	}

	//console.log($scope.addedIngredients);

	$scope.selectedIngredients = function selectedIngredients() {
		return filterFilter($scope.ingredienten, { selected: true });
	};



	$scope.addIngredient = function (addedingredient) {
		console.log($scope.ingredientCheckbox);
		if($scope.ingredientCheckbox[addedingredient]) {
			$scope.addedIngredients.push(addedingredient);
		} else {
			$scope.addedIngredients.splice(addedingredient);
		}
	};



	$scope.addGerecht = function(nieuwgerecht){
		nieuwgerecht.ingredienten = $scope.addedIngredients;
		Gerecht.create(nieuwgerecht);
		$scope.addedIngredients = [];
		$scope.newdish.ingredienten = null;
		$scope.newdish.name = null;
	};

}]);

//app.controller('ingredientController', ['$scope','Ingredient', function($scope,Ingredient){
//
//}]);

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