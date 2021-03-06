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
		var user = firebase.auth().currentUser;
		Auth.logout(user, ref);
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

		if(angular.isDefined(user)) {
			Utils.show();
			Auth.login(user).then(function(authData) {
				Utils.hide();

				window.plugins.OneSignal.getIds(function(ids) {

					ref.child("users").child(authData.uid).child("player_id").set(ids.userId);
				});

				$state.go('tab.channels');
			}, function(e) {
				Utils.hide();
				Utils.errorMessage(e);
			});
		}
	};
})

.controller('ProfileCtrl', function ($scope, $state, $cordovaOauth, $localStorage, $location, $http,$ionicPopup, $firebaseObject, $log, Auth, FURL, Utils) {
	$scope.user = angular.fromJson($localStorage.profile);

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
		}
	};
})


.controller('ChatsCtrl', function($ionicPlatform, $scope, $state, $stateParams, $firebase, $firebaseArray, $firebaseAuth, $location, $log, Auth, FURL, Utils) {
	var ref = firebase.database().ref();
	var user = firebase.auth().currentUser;
	var channelRef = ref.child('channels').child($stateParams.channelId);
	var sendPID;
	var message = $scope.msg;


	$scope.$on('$ionicView.enter', function() {
		user = firebase.auth().currentUser;
		var timestamp = Date();

		//Puts users's lastViewed timestamp in channel
		channelRef.child('users').child(user.uid).child('lastViewed').set(timestamp);


		var userRef = firebase.database().ref().child('users').child(user.uid);
		userRef.child('onlineStatus').set($stateParams.channelId);
		userRef.child('channels').child($stateParams.channelId).child('unread').set(null);

		$scope.messages = $firebaseArray(channelRef.child('chats'));

		channelRef.off();	

		channelRef.on('child_added', setMessages);
		channelRef.on('child_changed', setMessages);
	});


	$scope.$on('$ionicView.beforeLeave', function() {
		var timestamp = Date();

		//Puts users's lastViewed timestamp in channel
		channelRef.child('users').child(user.uid).child('lastViewed').set(timestamp);

	})

	var setMessages = function (data) {
		$scope.messages = $firebaseArray(channelRef.child('chats'));
	}

	$scope.addMessage = function(e) {
		user = firebase.auth().currentUser;

    	$scope.sendMsg = function() {
    		message =$scope.msg;
    		if (message.trim() != "") {
    			var stamp = new Date();

	    		$scope.messages.$add({message: $scope.msg, date: stamp, name: user.email, userId: user.uid});
	    		channelRef.child('users').once('value', function(snapshot) {

					snapshot.forEach(function(childSnapshot) {
						var recipientId = childSnapshot.child('userId').val();
						var userRef = ref.child("users").child(recipientId);


						userRef.child("onlineStatus").once("value", function(statusSnap) {
							// alert("RID: " + recipientId + "UID: " + user.uid + "STATUS: " + statusSnap.val() + "CHANID: " + $stateParams.channelId);


							if (recipientId != user.uid && statusSnap.val() != $stateParams.channelId) {

								userRef.child('channels').child($stateParams.channelId).child('unread').transaction(function(unread) {
									if (unread == null) {
										return 1;
									} else {

									return parseInt(unread)+1;
									}
								});

								userRef.child("player_id").once("value", function(pidSnap) {

									if( pidSnap.val() != null) {
									sendPID = pidSnap.val();

									var notificationObj = {
									// app_id: "f4b1938f-dc11-4784-bb88-737ef29292ab", 
									contents: {en: message},
									include_player_ids: [sendPID],
									data: {chanId: $stateParams.channelId},
									android_group: $stateParams.channelId
									};

								  	window.plugins.OneSignal.postNotification(notificationObj,
									    function(successResponse) {
									  	$scope.msg = "";
									      console.log("Notification Post Success:", successResponse);
									    },
									    function (failedResponse) {
									    $scope.msg = "";
									      console.log("Notification Post Failed: ", failedResponse);
									      alert("Notification Post Failed:\n" + JSON.stringify(failedResponse));
									    }
									    );

									} else {
										$scope.msg = "";
									}
								});
								
								
							} else {
								$scope.msg = "";
							}
						});
					});
				});     	
    		}
        }
    }

    $scope.clear = function(){
      $scope.name = "";
    }

    $scope.goBack = function() {
    	$state.go('tab.channels');
	}

})

.controller('UsersCtrl', function($scope, $state, $firebase, $firebaseArray, $location, Auth, FURL) {
	var ref = firebase.database().ref();
	var usersRef = ref.child('users');
	var channelsRef = ref.child('channels')
	var user = firebase.auth().currentUser;


	$scope.$on('$ionicView.enter', function() {
		user = firebase.auth().currentUser;
		$scope.users = $firebaseArray(usersRef);

	});

	$scope.openOneChannel = function(user2id) {
		user = firebase.auth().currentUser;

		var userPID;
		var user2PID;
		var user2email;

		usersRef.child(user.uid).child('player_id').on('value', function(snapshot) {
			userPID = snapshot.val();
		});

		usersRef.child(user2id).child('player_id').on('value', function(snapshot) {
			user2PID = snapshot.val();
		});

		usersRef.child(user2id).child('email').on('value', function(snapshot) {
			user2email = snapshot.val();
		});

		var channelId = (user.uid<user2id ? user.uid+'_'+user2id : user2id+'_'+user.uid);

		//Puts channel creator's uid in channel
		channelsRef.child(channelId).child('users').child(user.uid).child('userId').set(user.uid);
		//Puts channel creator's player_id in channel
		channelsRef.child(channelId).child('users').child(user.uid).child('player_id').set(userPID);
		//Puts channel ID in channel
		channelsRef.child(channelId).child('channelId').set(channelId);

		//Sets channel name (to user2email) in channel creator's node
		usersRef.child(user.uid).child('channels').child(channelId).child('name').set(user2email);
		//Puts channel ID in channel creator's node
		usersRef.child(user.uid).child('channels').child(channelId).child('channelId').set(channelId);

		//Puts user2's uid in channel
		channelsRef.child(channelId).child('users').child(user2id).child('userId').set(user2id);
		//Puts user2's player_id in channel
		channelsRef.child(channelId).child('users').child(user2id).child('player_id').set(user2PID);

		//Sets channel name (to channel creator's email) in user2's node
		usersRef.child(user2id).child('channels').child(channelId).child('name').set(user.email);
		//Puts channel ID in user2's node
		usersRef.child(user2id).child('channels').child(channelId).child('channelId').set(channelId);

      	$state.go('channel', {channelId: channelId})
	}
})

.controller('AccountCtrl', function($scope, $state, $firebase) {

	$scope.logOut = function () {
    	user = firebase.auth().currentUser;
		Auth.logout(user, ref);
		$state.go("login");
	}
})

.controller('ChannelsListCtrl', function($scope, $state, $firebase, $firebaseArray, $log, Auth, FURL) {
	var user = firebase.auth().currentUser;
	var ref = firebase.database().ref();
	var userChannelsRef;
	var allChannelsRef =  ref.child('channels');
	var allChannels = [];


	$scope.$on('$ionicView.beforeEnter', function() {
		user = firebase.auth().currentUser;

		if (user != null) {
			var userRef = firebase.database().ref().child('users').child(user.uid);

			userChannelsRef = ref.child('users').child(user.uid).child('channels');

			userChannelsRef.off();	

			userChannelsRef.on('child_added', setChannels);
			userChannelsRef.on('child_changed', setChannels);

			userRef.child('onlineStatus').set("active");
		} else {
			$state.go('login')
		}
		

	})

	var setChannels = function (data) {
		$scope.channels = $firebaseArray(userChannelsRef);
	}


	$scope.openChannel = function(channelId) {
		user = firebase.auth().currentUser;

      	$state.go('channel', {channelId: channelId})
	}

})
;