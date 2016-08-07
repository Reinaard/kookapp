var app =  angular.module('kookApp', ['firebase']);


app.controller('kookController', ['$scope','Gerecht','Ingredient','Planner', function($scope, Gerecht, Ingredient, Planner){
	$scope.gerechten = Gerecht.all;
	$scope.ingredienten = Ingredient.all;
	$scope.planners = Planner.all;
	$scope.boodschappen = [];

	$scope.selected = [];
	$scope.selectedPlanner = [];

	$scope.toggle = function (inputCheckbox, type) {
		if (type === "gerechtPlanner") {
			var idx = $scope.selectedPlanner.indexOf(inputCheckbox);
			var array = $scope.selectedPlanner;
		}
		else {
			var idx = $scope.selected.indexOf(inputCheckbox);
			var array = $scope.selected;
		}
		if (idx > -1) {
			array.splice(idx, 1);
		}
		else {
			array.push(inputCheckbox);
		}
	};

	$scope.addIngredient = function (item) {
		var exists = false;
		var ref = new Firebase("https://kookapp-22c31.firebaseio.com/data/ingredienten");
		ref.once("value", function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
				var val = childSnapshot.val();
				if(val.toLowerCase() == item.toLowerCase()) {
					exists = true;
				}
			});
		});
		if(!exists) {
			Ingredient.create(item);
		}
	};

	$scope.addGerecht = function(nieuwGerecht){
		console.log("nieuwe gerechtnaam: ", nieuwGerecht);
		nieuwGerecht.ingredienten = [];
		for(var i = 0; i < $scope.selected.length; i++) {
			nieuwGerecht.ingredienten.push($scope.selected[i]);
		}
		Gerecht.create(nieuwGerecht);

		$scope.selected = [];

		$scope.nieuwGerecht.ingredienten = [];
		$scope.nieuwGerecht.name = "";

		angular.forEach($scope.ingredienten, function (item) {
			item.selected = false;
		});
	};

	$scope.addPlanner = function(nieuwPlanner){
		console.log("nieuwe planner naam: ", nieuwPlanner);
		nieuwPlanner.gerechten = [];
		for(var i = 0; i < $scope.selectedPlanner.length; i++) {
			nieuwPlanner.gerechten.push($scope.selectedPlanner[i]);
		}
		Planner.create(nieuwPlanner);

		$scope.selectedPlanner = [];

		$scope.nieuwPlanner.ingredienten = [];
		$scope.nieuwPlanner.name = "";

		angular.forEach($scope.gerechten, function (item) {
			item.selected = false;
		});
	};

	$scope.getShoppingList = function(nieuwPlanner) {
		console.log("nieuwe planner getShoppingList",nieuwPlanner);
		console.log("gerechten in planner getShoppingList",$scope.selectedPlanner);

		var gerecht = Gerecht.get("-KMQK1qXLtLlhNYG8EjK");
		console.log("opgehaalde gerecht",gerecht);
		$scope.boodschappen.push(gerecht);
		console.log("opgehaalde gerecht",$scope.boodschappen);
		// TODO:get ingredients from all selected dishes
	};

}]);

app.factory('Gerecht', ['$firebase',
	function($firebase) {
		var ref = new Firebase('https://kookapp-22c31.firebaseio.com/data');
		var gerechten = $firebase(ref.child('gerechten')).$asArray();

		var Gerecht = {
			all: gerechten,
			create: function (nieuwgerecht) {
				console.log(nieuwgerecht);
				return gerechten.$add(nieuwgerecht);
			},
			get: function (gerechtId) {
				return $firebase(ref.child('gerechten').child(gerechtId)).$asArray();
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
				return $firebase(ref.child('ingredienten').child(ingredientId));
			},
			delete: function (ingredient) {
				return ingredienten.$remove(ingredient);
			}
		};

		return Ingredient;

	}
]);

app.factory('Planner', ['$firebase',
	function($firebase) {
		var ref = new Firebase('https://kookapp-22c31.firebaseio.com/data');
		var planners = $firebase(ref.child('planner')).$asArray();

		var Planner = {
			all: planners,
			create: function (planner) {
				return planners.$add(planner);
			},
			get: function (plannerId) {
				return $firebase(ref.child('planner').child(plannerId));
			},
			delete: function (planner) {
				return planners.$remove(planner);
			}
		};

		return Planner;

	}
]);

