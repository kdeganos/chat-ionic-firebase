angular.module('chat.services', ['firebase'])

.factory('Auth', function (FURL, $log, $firebaseAuth, $firebaseArray, $firebaseObject, $ionicLoading, $location, Utils) {

	var ref = firebase.database().ref();

	var auth = $firebaseAuth();

	var Auth = {
		user: {},

		login: function(user) {

			return auth.$signInWithEmailAndPassword(user.email, user.password);
		},

		createProfile: function(uid, user) {
						
			window.plugins.OneSignal.getIds(function(ids) {

			 	var profile = {
					id: uid,
					email: user.email,
					registration_date: Date(),
					player_id: ids.userId
				};
			ref.child("users").child(uid).set(profile);
			});

		},

		register: function(user) {
			return auth.$createUserWithEmailAndPassword(user.email, user.password)

				.then(function(firebaseUser) {
					Auth.createProfile(firebaseUser.uid, user);
					
                	$ionicLoading.hide();
                	Utils.showAlert("Welcome!","Account successfully created.");
                	$location.path("/tab-users");
				}).catch(function(e) {
					console.log(e);
					Utils.showAlert("Error: ", e.message);
					$ionicLoading.hide();
				});
		},

		logout: function(user) {
			ref.child("users").child(user.uid).child("player_id").remove();
			auth.$signOut();
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

.factory('Utils', function($ionicLoading, $ionicPopup, $firebase) {
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
		},

		dateCompare: function(send, last) {
			var sendDate = Date.parse(send);
			var lastDate = Date.parse(last);
		}
	};
	return Utils;
})


;