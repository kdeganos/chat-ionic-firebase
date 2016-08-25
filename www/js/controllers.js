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

.controller('OneToOneCtrl', function($scope, $state, $firebase, $firebaseArray, $firebaseAuth, $location, Auth, FURL) {


})

.controller('ChatsCtrl', function($scope, $state, $stateParams, $firebase, $firebaseArray, $firebaseAuth, $location, Auth, FURL) {
	var ref = firebase.database().ref();
	var user = firebase.auth().currentUser;
	var channelRef = ref.child("channels").child($stateParams.channelId);

	console.log($stateParams.channelId);

	$scope.$on('$ionicView.enter', function() {
		user = firebase.auth().currentUser;

		$scope.messages = $firebaseArray(channelRef);

		channelRef.off();	

		channelRef.on('child_added', setMessages);
		channelRef.on('child_changed', setMessages);
	});

	var setMessages = function (data) {
		$scope.messages = $firebaseArray(channelRef);
	}

	$scope.addMessage = function(e) {
		user = firebase.auth().currentUser;

    	$scope.sendMsg = function() {
             $scope.messages.$add({message: $scope.msg, date: Date(), name: user.email, userId: user.uid});
             $scope.msg = "";
        }
    }
    $scope.clear = function(){
      $scope.name = "";
    }

	

	// $scope.messages = $firebaseArray(chatsRef);
 //        $scope.addMessage = function(e) {
 //           $scope.sendMsg = function() {
             	
             	
 //             	element.scrollTop = element.scrollHeight;

 //                 $scope.messages.$add({message: $scope.msg, date: Date(), name: user.email, userId: user.uid});
 //                 $scope.msg = "";
           
 //                }
 //        }
 //        $scope.clear = function(){
 //          $scope.name = "";
 //        }
    
    $scope.logOut = function () {
		Auth.logout();
		$state.go("login");
	}
        


})

.controller('UsersCtrl', function($scope, $state, $firebase, $firebaseArray, $location, Auth, FURL) {
	var ref = firebase.database().ref();
	var usersRef = ref.child('users');
	var user = firebase.auth().currentUser;

	$scope.$on('$ionicView.enter', function() {
		user = firebase.auth().currentUser;
		$scope.users = $firebaseArray(usersRef);

	});

	$scope.openOneChannel = function(user2id) {
		user = firebase.auth().currentUser;

		var channelId = (user.uid<user2id ? user.uid+'_'+user2id : user2id+'_'+user.uid);

      	$location.path("/channel/" + channelId);
	}
})

.controller('AccountCtrl', function($scope, $state, $firebase) {
})

.controller('ChatsListCtrl', function($scope, $state, $firebase, $firebaseArray, Auth, FURL) {
	var ref = firebase.database().ref();
	var usersRef = ref.child("users");

	$scope.$on('$ionicView.enter', function() {
		console.log(usersRef.toString());
		$scope.users = $firebaseArray(usersRef);

	});
})
;