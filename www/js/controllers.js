angular.module('chat.controllers', [])

.controller('homeController', function($scope, $state, $cordovaOauth, $localStorage, $log, $locatoin, $http, $ionicPopup, $firebaseObject, Auth, FURL, Utils) {
	var ref = firebase.database().ref();

	$scope.logOut = function () {
		Auth.logout();
		$location.path("/login");
	}

	$scope.profile = function () {
		$location.path("/profile");
	}
})

.controller('loginController', function($scope, $state, $cordovaOauth, $localStorage, $log, $locatoin, $http, $ionicPopup, $firebaseObject, Auth, FURL, Utils) {
	var auth = $firebaseAuth();
	var ref = firebase.database().ref();
	var userkey = "";

	$scope.signIn = function(user) {
		$log.log("Sent");

		if(angular.isDefined(user)) {
			Utils.show();
			Auth.login(user).then(function(authData) {
				$log.log("User ID: " + authData);
				Utils.hide();
				$state.go('home');
				$log.log("Chat", "Home");
			}, function(e) {
				Utils.hide();
				Utils.errorMessage(e);
			});
		}
	};
});