var app =  angular.module('kookApp', ['firebase', 'ngAnimate']);

app.controller('kookController', ['$scope','Gerecht','Ingredient','Planner', function($scope, Gerecht, Ingredient, Planner){
	$scope.gerechten = Gerecht.all;
	$scope.ingredienten = Ingredient.all;
	$scope.planners = Planner.all;
	$scope.boodschappen = [];

	$scope.selected = [];
	$scope.selectedPlanner = [];
	
	$scope.gewichtIngr = [];
	$scope.selectedDish = null;

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

	$scope.filterIngredients = function(arg) {

		var inputName = $scope.ingredientenLijst;

		if (inputName != undefined && inputName != "") {
			if (arg.name.toLowerCase().indexOf(inputName.toLowerCase()) !== -1) {
				return true;
			} else {
				return false;
			}
		} else {
			return true;
		}
	};

	$scope.filterDish = function(arg) {
		// console.log("input filterDish ",arg);
		// console.log("input filterDish name ",arg.name);

		var inputName = $scope.gerechtenLijst;
		var item = arg.name;
		// console.log("input naam ",inputName);

		if (inputName != undefined && inputName != "") {
			if (item.toLowerCase().indexOf(inputName.toLowerCase()) !== -1) {
				return true;
			} else {
				return false;
			}
		} else {
			return true;
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

	$scope.addGerecht = function(nieuwGerechtInput){
		nieuwGerechtInput.ingredienten = [];
		for(var i = 0; i < $scope.selected.length; i++) {
			var gewicht = $scope.selected[i].gewicht;
			var gerechtToAdd =  {
				"dishName" : $scope.selected[i].$value,
				"gewicht" : parseInt(gewicht)
			} ;
			nieuwGerechtInput.ingredienten.push(gerechtToAdd);
		}

		Gerecht.create(nieuwGerechtInput);

		$scope.selected = [];
		nieuwGerechtInput.ingredienten = [];
		nieuwGerechtInput.name = "";
		angular.forEach($scope.ingredienten, function (item) {
			item.selected = false;
		});
	};

	$scope.addPlanner = function(nieuwPlanner){
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
		var boodschappenLijst = $scope.boodschappen;

		var alreadyAdded = false;
		for(var i = 0; i < boodschappenLijst.length; i++) {
			if(ingredient.dishName == boodschappenLijst[i].dishName) {
				alreadyAdded = true;
				boodschappenLijst[i].gewicht += ingredient.gewicht;
			}
		}
		if(!alreadyAdded) {
			var ingredientToAdd =  {
				"dishName" : ingredient.dishName,
				"gewicht" : ingredient.gewicht
			} ;
			boodschappenLijst.push(ingredientToAdd);
		}
	}

	$scope.getShoppingList = function() {
		var objectArray = $scope.selectedPlanner;
		for(var i = 0; i < objectArray.length; i++) {
			var ingredienten = objectArray[i].ingredienten;
			for (var j = 0; j < ingredienten.length; j++) {
				$scope.addToShoppingList(ingredienten[j]);
			}
		}
	};
	
	$scope.checkAddDish = function(nieuwGerechtInput) {
		if(nieuwGerechtInput != undefined && nieuwGerechtInput.name != "") {
			if ($scope.selected.length > 0) {
				return false;
			}
			else {
				return true;
			}
		} else {
			return true;
		}
	};

	$scope.checkAddPlanner = function(nieuwPlanner) {
		if(nieuwPlanner != undefined && nieuwPlanner.name != "") {
			if ($scope.selectedPlanner.length > 0) {
				return false;
			}
			else {
				return true;
			}
		} else {
			return true;
		}
	};


	$scope.popUP = function(gerecht) {
		$scope.selectedDish = gerecht;

		$scope.showModalDish = !$scope.showModalDish;
	}

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
		// console.log("Ingredienten uit Firebase", ingredienten);
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

