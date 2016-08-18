angular.module('chat.services', [])

.factory('Auth', function (FURL, $log, $firebaseAuth, $firebaseArray, $firebaseObject, Utils) {

	firebase.initializeApp(FURL);

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

			var messagesRef = $firebaseArray(firebase.database().ref().child("users"));
			messagesRef.$add(profile);
			$log.log("User Saved");
		},

		register: function(user) {
			return auth.$createUserWithEmailAndPassword(user.email, user.password)
				.then(function(firebaseUser) {
					console.log("User create with uid: " + firebaseUser.uid);
					Auth.createProfile(firebaseUser.uid, user);
				}).catch(function(error) {
					console.log(error);
				});
		},

		logout: function() {
			auth.$signOut();
			console.log("User logged out");
		},

		resetPassword: function(email) {
			return auth.$sendPaswordResetEmail(email)
				.then(function() {
					Utils.showAlert("Exit.", "A key has been sent to your email.")
				}).catch(function(error) {
					Utils.errorMessage(error);
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
			var msg = "Unknown Error...";

			if(e && e.code) {
				switch (e.code) {
					case "EMAIL_TAKEN": msg = "This email address has already been registered."; break;
					case "IVALID_EMAIL": msg = "Invalid email."; break;
					case "NETWORK_ERROR": msg = "Network Error."; break;
					case "INVALID_PASSWORD": msg = "Invalid Passowrd."; break;
					case "INVALID_USER": msg = "Invalid User."; break;
				}
			}
			Utils.showAlert("Error: ", msg);
		}
	};
	return Utils;
});