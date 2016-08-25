angular.module('chat.services', ['firebase'])

.factory('Auth', function (FURL, $log, $firebaseAuth, $firebaseArray, $firebaseObject, $ionicLoading, $location, Utils) {

	// firebase.initializeApp(FURL);

	var ref = firebase.database().ref();

	var auth = $firebaseAuth();

	var Auth = {
		user: {},

		login: function(user) {
			return auth.$signInWithEmailAndPassword(user.email, user.password);
		},

		createProfile: function(uid, user) {
			var profile = {
				id: uid,
				email: user.email,
				registration_date: Date()
			};

			ref.child("users").child(uid).set(profile);
			$log.log("User Saved");
		},

		register: function(user) {
			return auth.$createUserWithEmailAndPassword(user.email, user.password)
			// auth.$createUserWithEmailAndPassword(user.email, user.password)

				.then(function(firebaseUser) {
					// console.log("User created with uid: " + firebaseUser.uid);
					Auth.createProfile(firebaseUser.uid, user);

					
                	$ionicLoading.hide();
                	Utils.showAlert("Welcome!","Account successfully created.");
                	$location.path("/tab-users");
				}).catch(function(e) {
					console.log(e);
					Utils.showAlert("Error: ", e.message);
					$ionicLoading.hide();
				});



			// 	.then(function() {
			// 	Utils.hide();
			// 	// console.log("Account:" + JSON.stringify(user));
			// 	Utils.showAlert("Welcome!","Account successfully created.");
			// 	$location.path('/');
			// }, function(e) {
			// 	Utils.hide();
			// 	Utils.errorMessage(e);
			// });
		},

		logout: function() {
			auth.$signOut();
			console.log("User logged out");
		},

		resetPassword: function(email) {
			var fAuth = firebase.auth();
			return fAuth.sendPasswordResetEmail(email)
				.then(function() {
					Utils.showAlert("Password Reset Email", "A key has been sent to your email.")
				}).catch(function(e) {
					Utils.errorMessage(e);
				});
		},

		changePassword: function(user) {
			return auth.$changePassword({email: user.email, oldPassword: user.oldPass, newPassword: user.newPass});
		},
	}
	return Auth;
})

.factory('Utils', function($ionicLoading, $ionicPopup) {
	var Utils = {
		show: function() {
			$ionicLoading.show({
				animation: 'fade-in',
				showBackdrop: false,
				maxWidth: 200,
				showDelay: 500,
				template: '<p class="item-icon-left">Loading...<ion-spinner icon="lines"/></p>'
			});
		},

		hide: function(){
			$ionicLoading.hide();
		},

		showAlert: function(head, msg) {
			var alertPopup = $ionicPopup.alert({
				title: head,
				template: msg
			});
			alertPopup.then(function(res) {

			});
		},

		errorMessage: function(e) {
			// var msg = "Unknown Error...";

			// if(e && e.code) {
			// 	switch (e.code) {
			// 		case "auth/email-already-in-use": msg = e.message; break;
			// 		case "auth/invalid-email": msg = e.message; break;
			// 		case "NETWORK_ERROR": msg = "Network Error."; break;
			// 		case "auth/weak-password": msg = e.message; break;
			// 		case "INVALID_USER": msg = "Invalid User."; break;
			// 	}
			// }
			Utils.showAlert("Error: ", e.message);
		}
	};
	return Utils;
})

// .factory('Chats', function($firebase, Channels) {
// 	var selectedRoomId;

// 	var ref = firebase.database().ref();
//     var chats;

//     return {
//     	all: function() {
//     		return chats;
//     	},
//     	// remove: function(chat) {
//     	// 	chats.$remove(chat).then(function(ref) {
//     	// 		ref.key( === chat.$id;)
//     	// 	});
//     	// },
//     	// get: function(chatId) {

//     	// },
//     	getSelectedChannelName: function() {
//     		var selectedChannel;
//     		if (selectedChannelId && selectedChannelId != null) {
//     			selectedChannel = Channels.get(selectedChannelId);
//     			if (selectedChannel) {
//     				return selectedChannel.name;
//     			} else {
//     				return null;
//     			}
//     		} else {
//     			return null;
//     		}
//     	},
//     	selectChannel: function (channelId) {
//             console.log("selecting the channel with id: " + channelId);
//             selectedChannelId = channelId;
//             if (!isNaN(channelId)) {
//                 chats = $firebase(ref.child('channels').child(selectedChannelId).child('chats')).$asArray();
//             }
//         },
//     }
// })

// .factory('Channels', function($firebase) {
    
// 	var ref = firebase.database().ref();
//     var channels = ref.child('channels').$asArray();

//     return {
//         all: function() {
//             return channels;
//         },
//         get: function(roomId) {
//             // Simple index lookup
//             return channels.$getRecord(channelId);
//         }
//     }
// })
;