// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('chat', ['ionic', 'chat.controllers', 'chat.services', 'ngStorage', 'ngCordova', 'firebase', 'ngMessages', 'ngScrollGlue'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function(FURL) {

    // Enable to debug issues.
  // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
  
  var notificationOpenedCallback = function(jsonData) {
    console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
  };
  window.plugins.OneSignal.init("f4b1938f-dc11-4784-bb88-737ef29292ab",
                                 {googleProjectNumber: "672728738668"},
                                 notificationOpenedCallback);
  
  // window.plugins.OneSignal.getIds(function(ids) {
  //   console.log('getIds: ' + JSON.stringify(ids));
  //   alert("userId = " + ids.userId + ", pushToken = " + ids.pushToken);
  // });
  // Show an alert box if a notification comes in when the user is in your app.
  window.plugins.OneSignal.enableInAppAlertNotification(true);

    if(window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.users', {
    url: '/users',
    views: {
      'tab-users': {
        templateUrl: 'templates/tab-users.html',
        controller: 'UsersCtrl'
      }
    }
  })

  .state('tab.channels', {
      url: '/channels',
      views: {
        'tab-channels': {
          templateUrl: 'templates/tab-channels.html',
          controller: 'ChannelsListCtrl'
        }
      }
    })
    // .state('tab.chat-detail', {
    //   url: '/chats/:chatId',
    //   views: {
    //     'tab-chats': {
    //       templateUrl: 'templates/chat-detail.html',
    //       controller: 'ChatsCtrl'
    //     }
    //   }
    // })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

    .state('forgot-password', {
      url: '/forgot-password',
      templateUrl: 'templates/forgot-password.html',
      controller: 'ForgotPasswordCtrl'
    })
    .state('home', {
      url: '/home',
      templateUrl: 'templates/home.html',
      controller: 'ChatsCtrl'
    })
    .state('channel', {
      url: '/channel/:channelId',
      params: {channelId: {dynamic: true}},
      templateUrl: 'templates/channel.html',
      controller: 'ChatsCtrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })
    .state('registration', {
      url: '/registration',
      templateUrl: 'templates/registration.html',
      controller: 'RegistrationCtrl'
    });
    // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise("/login");
})

.constant('FURL', {
  apiKey: "AIzaSyBhfqJDokyEvwS8JgO0ANYuLOjVLYNHq_U",
  authDomain: "ionic-chat-fe17f.firebaseapp.com",
  databaseURL: "https://ionic-chat-fe17f.firebaseio.com",
  storageBucket: "ionic-chat-fe17f.appspot.com",
});
