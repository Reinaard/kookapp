var app =  angular.module('kookApp', ['firebase']);


app.controller('kookController', ['$scope','Gerecht','Ingredient','Planner', function($scope, Gerecht, Ingredient, Planner){
	$scope.gerechten = Gerecht.all;
	$scope.ingredienten = Ingredient.all;
	$scope.planners = Planner.all;
	$scope.boodschappen = [];

	$scope.selected = [];
	$scope.selectedPlanner = [];


	$scope.toggle = function (checkedObject, type) {
		if (type === "gerechtPlanner") {
			var idx = $scope.selectedPlanner.indexOf(checkedObject);
			var array = $scope.selectedPlanner;
		}
		else {
			var idx = $scope.selected.indexOf(checkedObject);
			var array = $scope.selected;
		}
		if (idx > -1) {
			array.splice(idx, 1);
		}
		else {
			array.push(checkedObject);
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

	$scope.addToShoppingList = function(ingredient) {
		var idx = $scope.boodschappen.indexOf(ingredient);
		var array = $scope.boodschappen;

		if (idx < 0) {
			array.push(ingredient);
		}
	}

	$scope.getShoppingList = function(nieuwPlanner) {
		var objectArray = $scope.selectedPlanner;
		for(i = 0; i < objectArray.length; i++) {
			console.log("gerecht object:",$scope.selectedPlanner[i]);

			var ingredienten = $scope.selectedPlanner[i].ingredienten;
			//$scope.boodschappen.push(ingredienten);
			console.log("IN GERECHT", ingredienten);

			for (j = 0; j < ingredienten.length; j++) {
				$scope.addToShoppingList(ingredienten[j]);
			}
			console.log("IN BOODSCHAPPENLIJST", $scope.boodschappen);
		}
	};
	
	$scope.checkAddDish = function(nieuwGerecht) {
		// console.log(nieuwGerecht);
		if ($scope.selected.length > 0 && nieuwGerecht != "") {
			return false;
		}
		else {
			return true;
		}
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

