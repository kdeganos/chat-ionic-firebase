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

.controller('ChatsCtrl', function($scope, $state, $stateParams, $firebase, $firebaseArray, $firebaseAuth, $location, $log, Auth, FURL) {
	var ref = firebase.database().ref();
	var user = firebase.auth().currentUser;
	var channelRef = ref.child('channels').child($stateParams.channelId);
	var sendPID;
	var message = $scope.msg;

	// $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
 //    	viewData.enableBack = true;
	// });

	$scope.$on('$ionicView.enter', function() {
		user = firebase.auth().currentUser;

		// $log.log(channelRef.child('users').child(user.uid).child('player_id'))

		// channelRef.child('users').once('value', function(snapshot) {
		//          $log.log(snapshot.val());

		// 	snapshot.forEach(function(childSnapshot) {
		//          // $log.log(childSnapshot.child('userId').val());

		// 		if (childSnapshot.child('userId').val() != user.uid) {			
		// 			sendPID = '"' + childSnapshot.child('player_id').val() + '"';
		// 		}
		// 	});
		// 	         $log.log(sendPID);

		// });

		$scope.messages = $firebaseArray(channelRef.child('chats'));

		channelRef.off();	

		channelRef.on('child_added', setMessages);
		channelRef.on('child_changed', setMessages);
	});

	var setMessages = function (data) {
		$scope.messages = $firebaseArray(channelRef.child('chats'));
	}

	$scope.addMessage = function(e) {
		user = firebase.auth().currentUser;

    	$scope.sendMsg = function() {
    		message = $scope.msg;

    		channelRef.child('users').once('value', function(snapshot) {
		         // $log.log(snapshot.val());

			snapshot.forEach(function(childSnapshot) {
		         // $log.log(childSnapshot.child('userId').val());

				if (childSnapshot.child('userId').val() != user.uid) {			
					var userRef = ref.child("users").child(childSnapshot.child("userId").val());
					userRef.child("player_id").once("value", function(pidSnap) {
						if( pidSnap.val() != null) {
						sendPID = pidSnap.val();
						$log.log("sendPID" + sendPID);

						var notificationObj = { app_id: "f4b1938f-dc11-4784-bb88-737ef29292ab", 
						contents: {en: message},
						include_player_ids: [sendPID],
						data: {chanId: "ZnAiqJYJRDb8wySLlLCIp9F3lor2_aCBftfT5zWgaC7uYuohUJ7mwFoV2"}
						};

					  	window.plugins.OneSignal.postNotification(notificationObj,
						    function(successResponse) {
						      console.log("Notification Post Success:", successResponse);
						    },
						    function (failedResponse) {
						      console.log("Notification Post Failed: ", failedResponse);
						      alert("Notification Post Failed:\n" + JSON.stringify(failedResponse));
						    }
						);


					}
					});
					
					
				}
			});

		});
             $scope.messages.$add({message: $scope.msg, date: Date(), name: user.email, userId: user.uid});


		
         $scope.msg = "";

        }
    }
    $scope.clear = function(){
      $scope.name = "";
    }

    $scope.goBack = function() {
    	$state.go('tab.channels');
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
    	user = firebase.auth().currentUser;
		Auth.logout(user, ref);
		$state.go("login");
	}
        


})

.controller('UsersCtrl', function($scope, $state, $firebase, $firebaseArray, $location, Auth, FURL) {
	var ref = firebase.database().ref();
	var usersRef = ref.child('users');
	var channelsRef = ref.child('channels')
	var user = firebase.auth().currentUser;

	// $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
 //    viewData.enableBack = true;
	// });

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


		// $scope.channelId = (user.uid<user2id ? user.uid+'_'+user2id : user2id+'_'+user.uid);

      	// $location.path("/channel/" + channelId);
      	$state.go('channel', {channelId: channelId})
	}
})

.controller('AccountCtrl', function($scope, $state, $firebase) {
})

.controller('ChannelsListCtrl', function($scope, $state, $firebase, $firebaseArray, $log, Auth, FURL) {
	var user = firebase.auth().currentUser;
	var ref = firebase.database().ref();
	var userChannelsRef;
	var allChannelsRef =  ref.child('channels');
	var allChannels = [];


	$scope.$on('$ionicView.beforeEnter', function() {
		// var authData = ref.getAuth();
			user = firebase.auth().currentUser;

		if (user != null) {

			userChannelsRef = ref.child('users').child(user.uid).child('channels');

			userChannelsRef.off();	

			userChannelsRef.on('child_added', setChannels);
			userChannelsRef.on('child_changed', setChannels);

			// $scope.channels = $firebaseArray(userChannelsRef);
		} else {
			$state.go('login')
		}
		
		// userChannelsRef = ref.child('users').child(user.uid).child('channels');
		// 	$scope.channels = $firebaseArray(userChannelsRef);

	})

	var setChannels = function (data) {
		$scope.channels = $firebaseArray(userChannelsRef);
	}

	// $scope.$on('$ionicView.enter', function() {
	// 	user = firebase.auth().currentUser;

	// 	userChannelsRef = ref.child('users').child(user.uid).child('channels');
	// 	$scope.channels = $firebaseArray(userChannelsRef);
		

	// })

	$scope.openChannel = function(channelId) {
		user = firebase.auth().currentUser;
      	$state.go('channel', {channelId: channelId})
	}

})
;