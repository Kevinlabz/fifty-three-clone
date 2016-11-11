angular.module('fifty-three', ['ui.router', 'angular-stripe'])
.config(($stateProvider, $urlRouterProvider, stripeProvider) => {

  stripeProvider.setPublishableKey('pk_test_oG3v6EKMryCurl1Q4D8tlv3m');

  $urlRouterProvider.otherwise('/pencil')

  $stateProvider
  .state('paper', {
    url: '/paper',
    templateUrl: './app/paper/paper.html',
    controller: 'paperCtrl'
  })
  .state('pencil', {
    url: '/pencil',
    templateUrl: './app/pencil/pencil.html',
    controller: 'pencilCtrl'
  })
  .state('shop', {
    url: '/shop',
    templateUrl: './app/shop/shop.html',
    controller: 'shopCtrl'
  })
  .state('cart', {
    url: '/cart/:userid',
    templateUrl: './app/cart/cart.html',
    controller: 'shopCtrl'
  })



})
