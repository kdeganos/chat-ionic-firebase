angular.module('chat.controllers', [])

.controller('ForgotPasswordCtrl', function ($scope, $state, $cordovaOauth, $localStorage, $location,$http, $ionicPopup, $firebaseObject, Auth, FURL, Utils) {

	$scope.resetpassword = function(user) {
		if(angular.isDefined(user)){
			Auth.resetPassword(user.email)
			.then(function() {
          $location.path('/login');
      			}, function(e) {
       		});
		}
	};
})

.controller('HomeCtrl', function($scope, $state, $cordovaOauth, $localStorage, $log, $location, $http, $ionicPopup, $firebaseObject, Auth, FURL, Utils) {
	var ref = firebase.database().ref();

	$scope.logOut = function () {
		Auth.logout();
		$location.path("/login");
	}

	$scope.profile = function () {
		$location.path("/profile");
	}
})

.controller('LoginCtrl', function($scope, $state, $cordovaOauth, $localStorage, $log, $location, $http, $ionicPopup, $firebaseAuth, $firebaseObject, $log, Auth, FURL, Utils) {
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
				$state.go('tab.users');
				// $log.log("Chat", "Home");
			}, function(e) {
				Utils.hide();
				Utils.errorMessage(e);
			});
		}
	};
})

.controller('ProfileCtrl', function ($scope, $state, $cordovaOauth, $localStorage, $location, $http,$ionicPopup, $firebaseObject, $log, Auth, FURL, Utils) {
	// var ref = new Firebase(FURL);
	$scope.user = angular.fromJson($localStorage.profile);
	$log.log("User:", $localStorage.email);

	$scope.logOut = function () {
		Auth.logout();
		$location.path("/login");
	};

})

.controller('RegistrationCtrl', function ($scope, $state, $cordovaOauth, $localStorage, $location, $http, $ionicPopup, $firebaseObject, Auth, FURL, Utils) {

	$scope.register = function(user) {
		if(angular.isDefined(user)){
			Utils.show();
			Auth.register(user);
			// .then(function() {
			// 	Utils.hide();
			// 	// console.log("Account:" + JSON.stringify(user));
			// 	Utils.showAlert("Welcome!","Account successfully created.");
			// 	$location.path('/');
			// }, function(e) {
			// 	Utils.hide();
			// 	Utils.errorMessage(e);
			// });
		}
	};
})

.controller('ChatsCtrl', function($scope, $state, $firebase, $firebaseArray, $firebaseAuth, $location, Auth, FURL) {
	var ref = firebase.database().ref();
	var user = firebase.auth().currentUser;
	var chatsRef = ref.child("chats");
	var element = document.getElementById("chatbox");

	// chatsRef.on('child_added', function(data) {
	// 	element.scrollTop = element.scrollHeight;

	// })

	$scope.messages = $firebaseArray(chatsRef);
        $scope.addMessage = function(e) {
           $scope.sendMsg = function() {
             	
             	
             	element.scrollTop = element.scrollHeight;

                 $scope.messages.$add({message: $scope.msg, date: Date(), name: user.email, userId: user.uid});
                 $scope.msg = "";
           
                }
        }
        $scope.clear = function(){
          $scope.name = "";
        }
    
    $scope.logOut = function () {
		Auth.logout();
		$state.go("login");
	}
        


})

.controller('UsersCtrl', function($scope, $state, $firebase, $firebaseArray, Auth, FURL) {
	var ref = firebase.database().ref();
	var usersRef = ref.child("users");

	$scope.users = $firebaseArray(usersRef);
})

.controller('AccountCtrl', function($scope, $state, $firebase) {

})
;