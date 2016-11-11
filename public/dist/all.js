'use strict';

angular.module('fifty-three', ['ui.router']).config(function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/pencil');

  $stateProvider.state('paper', {
    url: '/paper',
    templateUrl: './app/paper/paper.html',
    controller: 'paperCtrl'
  }).state('pencil', {
    url: '/pencil',
    templateUrl: './app/pencil/pencil.html',
    controller: 'pencilCtrl'
  }).state('shop', {
    url: '/shop',
    templateUrl: './app/shop/shop.html',
    controller: 'shopCtrl'
  }).state('cart', {
    url: '/cart/:userid',
    templateUrl: './app/cart/cart.html',
    controller: 'shopCtrl'
  });
});
'use strict';

angular.module('fifty-three').service('authService', function ($http) {

  this.registerUser = function (user) {
    return $http({
      method: 'POST',
      url: '/register',
      data: user
    }).then(function (response) {
      return response;
    });
  };

  this.login = function (user) {
    return $http({
      method: 'POST',
      url: '/login',
      data: user
    }).then(function (response) {
      return response;
    });
  };

  this.getCurrentUser = function () {
    return $http({
      method: 'GET',
      url: '/me'
    });
  };

  this.getUserOrder = function (userid) {
    return $http({
      method: 'GET',
      url: '/api/order/' + userid
    });
  };

  this.addToCart = function (orderid, productid, qty) {
    return $http({
      method: "POST",
      url: '/api/add/item/cart/' + orderid,
      data: {
        id: productid,
        qty: qty
      }
    });
  };
});
'use strict';

angular.module('fifty-three').controller('cartCtrl', function ($scope, cartService, $stateParams, authService, $timeout, $state) {

  $scope.something = cartService.something;

  var fetchCart = function fetchCart() {
    authService.getUserOrder($stateParams.userid).then(function (response) {
      // console.log('second get to order: ');
      // console.log(response);
      $scope.userCart = response.data;
      var allProducts = $scope.userCart.products;
      var subtotal = 0;
      for (var i = 0; i < allProducts.length; i++) {
        subtotal += allProducts[i].qty * allProducts[i].price;
        $scope.schmotal = subtotal;
      }
    });
  };

  fetchCart();

  //===GET CART====
  // authService.getUserOrder($stateParams.userid)
  // .then((response) => {
  //   console.log('second get to order: ');
  //   console.log(response);
  //   $scope.userCart = response.data;
  // })


  //===CHANGE QTY OF ITEM========
  $scope.addQty = function (item_id, item_qty) {
    var adding = item_qty + 1;
    // console.log('item qty to update: ')
    // console.log(adding);
    cartService.updateQty(item_id, adding).then(function (response) {
      fetchCart();
    });
  };

  $scope.subtractQty = function (item_id, item_qty) {
    var subtracting = item_qty - 1;
    if (subtracting <= 0) {
      swal({
        title: "Remove item?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Remove",
        cancelButtonText: "Keep",
        animation: "slide-from-top"
      }, function () {
        cartService.removeItem(item_id).then(function (response) {
          fetchCart();
        });
      });
    } else {
      // console.log('item subtract');
      // console.log(subtracting);
      cartService.updateQty(item_id, subtracting);
      fetchCart();
    }
  };

  $scope.placeOrder = function (user_id, order_id) {
    cartService.placeOrder(user_id, order_id).then(function (response) {
      $state.go('shop');
    });
  };

  //===JQUERY==============
  // $(() => {
  //   $('.place-order-wrap').mouseover(() => {
  //     $('.place-order-wrap').css({
  //       "background": "black"
  //     })
  //   });
  //   $('.place-order-wrap').mouseleave(() => {
  //     $('.place-order-wrap').css({
  //       "background": "red"
  //     })
  //   });
  // })


  //===END CTRL=======
});
'use strict';

angular.module('fifty-three').service('cartService', function ($http, $q, $state) {

  this.updateQty = function (item_id, item_qty) {
    return $http({
      method: "PUT",
      url: '/api/update/qty/' + item_id + '/' + item_qty
    });
  };

  this.removeItem = function (item_id) {
    return $http({
      method: "DELETE",
      url: "/api/delete/item/cart/" + item_id
    });
  };

  this.placeOrder = function (user_id, order_id) {
    return $http({
      method: 'PUT',
      url: '/api/order/complete/' + order_id + '/' + user_id
    });
  };

  //===END SERVICE=======
});
'use strict';

angular.module('fifty-three').controller('paperCtrl', function ($scope, $timeout) {

  $timeout(function () {
    $(function () {
      $('.shade').fadeOut(2000);
    });
  }, 1000);
});
'use strict';

angular.module('fifty-three').controller('pencilCtrl', function ($scope, $anchorScroll, $location) {
  $scope.scrollTo = function (id) {
    $location.hash(id);
    $anchorScroll();
  };

  $scope.button = function () {
    swal({
      title: "Remove item from cart?",
      showCancelButton: true,
      confirmButtonText: "Yes, remove item.",
      imageUrl: 'https://cdn.shopify.com/s/files/1/0245/8513/t/7/assets/53-dark.svg?1246397996584665470',
      text: "Write something interesting:",
      type: "input",
      inputType: 'email',
      closeOnConfirm: false
    }, function (inputValue) {
      $scope.valueSup = inputValue;
      alert($scope.valueSup);
      swal({
        title: "Remove item from cart?",
        showCancelButton: true,
        confirmButtonText: "Yes, remove item.",
        imageUrl: 'https://cdn.shopify.com/s/files/1/0245/8513/t/7/assets/53-dark.svg?1246397996584665470',
        text: "Write something interesting:",
        type: "input"
      });
    });
  };
});
"use strict";

$(window).scroll(function () {

  var winScroll = $(this).scrollTop();

  //commented out console.log so it's not
  //logging all the time! Uncomment to debug.
  // console.log(winScroll);

  var scrollLocation = 7862;
  var scrollIncrement = 28;

  if (0 < winScroll) {
    $('.p-1').css({
      "z-index": "2"
    });
    $('.p-2, .p-3, .p-4, .p-5, .p-6, .p-7, .p-8, .p-9, .p-10, .p-11').css({
      "z-index": "-1"
    });
  }
  if (scrollLocation < winScroll) {
    $('.p-2').css({
      "z-index": "2"
    });
    $('.p-1, .p-3, .p-4, .p-5, .p-6, .p-7, .p-8, .p-9, .p-10, .p-11').css({
      "z-index": "-1"
    });
  }
  if (scrollLocation + scrollIncrement * 2 < winScroll) {
    $('.p-3').css({
      "z-index": "2"
    });
    $('.p-1, .p-2, .p-4, .p-5, .p-6, .p-7, .p-8, .p-9, .p-10, .p-11').css({
      "z-index": "-1"
    });
  }
  if (scrollLocation + scrollIncrement * 3 < winScroll) {
    $('.p-4').css({
      "z-index": "2"
    });
    $('.p-1, .p-2, .p-3, .p-5, .p-6, .p-7, .p-8, .p-9, .p-10, .p-11').css({
      "z-index": "-1"
    });
  }
  if (scrollLocation + scrollIncrement * 4 < winScroll) {
    $('.p-5').css({
      "z-index": "2"
    });
    $('.p-1, .p-2, .p-3, .p-4, .p-6, .p-7, .p-8, .p-9, .p-10, .p-11').css({
      "z-index": "-1"
    });
  }
  if (scrollLocation + scrollIncrement * 5 < winScroll) {
    $('.p-6').css({
      "z-index": "2"
    });
    $('.p-1, .p-2, .p-3, .p-4, .p-5, .p-7, .p-8, .p-9, .p-10, .p-11').css({
      "z-index": "-1"
    });
  }
  if (scrollLocation + scrollIncrement * 6 < winScroll) {
    $('.p-7').css({
      "z-index": "2"
    });
    $('.p-1, .p-2, .p-3, .p-4, .p-5, .p-6, .p-8, .p-9, .p-10, .p-11').css({
      "z-index": "-1"
    });
  }
  if (scrollLocation + scrollIncrement * 7 < winScroll) {
    $('.p-8').css({
      "z-index": "2"
    });
    $('.p-1, .p-2, .p-3, .p-4, .p-5, .p-6, .p-7, .p-9, .p-10, .p-11').css({
      "z-index": "-1"
    });
  }
  if (scrollLocation + scrollIncrement * 8 < winScroll) {
    $('.p-9').css({
      "z-index": "2"
    });
    $('.p-1, .p-2, .p-3, .p-4, .p-5, .p-6, .p-7, .p-8, .p-10, .p-11').css({
      "z-index": "-1"
    });
  }
  if (scrollLocation + scrollIncrement * 9 < winScroll) {
    $('.p-10').css({
      "z-index": "2"
    });
    $('.p-1, .p-2, .p-3, .p-4, .p-5, .p-6, .p-7, .p-8, .p-9, .p-11').css({
      "z-index": "-1"
    });
  }
  if (scrollLocation + scrollIncrement * 10 < winScroll) {
    $('.p-11').css({
      "z-index": "2"
    });
    $('.p-1, .p-2, .p-3, .p-4, .p-5, .p-6, .p-7, .p-8, .p-9, .p-10').css({
      "z-index": "-1"
    });
  }

  // PARALLAX

  //BLUETOOTH

  var parallaxRatio = 4899;
  //parallaxRatio variable not fully implemented yet
  // ^^ DO NOT USE ^^

  if (winScroll > parallaxRatio) {
    $('.bluetooth').css({
      'position': 'fixed',
      'top': parallaxRatio - 4387
    });
  } else {
    $('.bluetooth').css({
      'position': 'static'
    });
  };
  if (winScroll > parallaxRatio + 150) {
    $('.bluetooth').css({
      'position': 'absolute',
      'top': parallaxRatio - 4636
    });
  };
  // BODY
  if (winScroll > parallaxRatio - 10) {
    $('.body').css({
      'position': 'fixed',
      'top': parallaxRatio - 4377
    });
  } else {
    $('.body').css({
      'position': 'absolute',
      'top': parallaxRatio - 4784
    });
  }
  if (winScroll > parallaxRatio + 501) {
    $('.body').css({
      'position': 'absolute',
      'top': parallaxRatio - 4271
    });
  }
  // BATTERY
  if (winScroll > parallaxRatio) {
    $('.battery').css({
      'position': 'fixed',
      'top': parallaxRatio - 4387
    });
  } else {
    $('.battery').css({
      'position': 'static'
    });
  };
  if (winScroll > parallaxRatio + 681) {
    $('.battery').css({
      'position': 'absolute',
      'top': parallaxRatio + 3802
    });
  };
  if (winScroll > parallaxRatio + 818) {
    $('.battery').css({
      'position': 'fixed',
      'top': parallaxRatio - 4697
    });
  };
  if (winScroll > parallaxRatio + 1456) {
    $('.battery').css({
      'position': 'absolute',
      'top': parallaxRatio - 3639
    });
  }

  // SENSOR
  if (winScroll > parallaxRatio) {
    $('.sensor').css({
      'position': 'fixed',
      'top': parallaxRatio - 4387
    });
  } else {
    $('.sensor').css({
      'position': 'static'
    });
  };
  if (winScroll > parallaxRatio + 881) {
    $('.sensor').css({
      'position': 'absolute',
      'top': parallaxRatio - 3809
    });
  };
  if (winScroll > parallaxRatio + 1025) {
    $('.sensor').css({
      'position': 'fixed',
      'top': parallaxRatio - 4438
    });
  };
  if (winScroll > 6351) {
    $('.sensor').css({
      'position': 'absolute',
      'top': '1515px'
    });
  }
  if (winScroll > 6570) {
    $('.sensor').css({
      'position': 'fixed',
      'top': '241px'
    });
  }
  if (winScroll > 6725) {
    $('.sensor').css({
      'position': 'absolute',
      'top': '1670px'
    });
  }

  // TIP
  if (winScroll > parallaxRatio) {
    $('.tip').css({
      'position': 'absolute',
      'top': "1098px"
    });
  } else {
    $('.tip').css({
      'position': 'static'
    });
  };
  if (winScroll > 5780) {
    $('.tip').css({
      'position': 'absolute',
      'top': '1097px'
    });
  };
  if (winScroll > 5924) {
    $('.tip').css({
      'position': 'fixed',
      'top': '468px'
    });
  };
  if (winScroll > 6700) {
    $('.tip').css({
      'position': 'absolute',
      'top': '1875px'
    });
  }

  //HIDDEN TEXT FOR PARALLAX

  //eraser
  if (winScroll > 4933) {
    $('.left-eraser').fadeIn(600);
  } else if (winScroll <= 4933) {
    $('.left-eraser').fadeOut(600);
  }
  if (winScroll > 4935) {
    $('.right-eraser').fadeIn(600);
  } else if (winScroll <= 4935) {
    $('.right-eraser').fadeOut(600);
  }
  //bluetooth
  if (winScroll > 5125) {
    $('.left-bluetooth').fadeIn(600);
  } else if (winScroll <= 5125) {
    $('.left-bluetooth').fadeOut(600);
  }
  if (winScroll > 5127) {
    $('.right-bluetooth').fadeIn(600);
  } else if (winScroll <= 5127) {
    $('.right-bluetooth').fadeOut(600);
  }
  //body
  if (winScroll > 5470) {
    $('.left-body').fadeIn(600);
  } else if (winScroll <= 5470) {
    $('.left-body').fadeOut(600);
  }
  if (winScroll > 5472) {
    $('.right-body').fadeIn(600);
  } else if (winScroll <= 5472) {
    $('.right-body').fadeOut(600);
  }
  //battery
  if (winScroll > 6145) {
    $('.left-battery').fadeIn(600);
  } else if (winScroll <= 6145) {
    $('.left-battery').fadeOut(600);
  }
  if (winScroll > 6147) {
    $('.right-battery').fadeIn(600);
  } else if (winScroll <= 6147) {
    $('.right-battery').fadeOut(600);
  }
  //sensor
  if (winScroll > 6548) {
    $('.left-sensor').fadeIn(600);
  } else if (winScroll <= 6548) {
    $('.left-sensor').fadeOut(600);
  }
  if (winScroll > 6550) {
    $('.right-sensor').fadeIn(600);
  } else if (winScroll <= 6550) {
    $('.right-sensor').fadeOut(600);
  }
  //tip
  if (winScroll > 6738) {
    $('.left-tip').fadeIn(600);
  } else if (winScroll <= 6738) {
    $('.left-tip').fadeOut(600);
  }
  if (winScroll > 6740) {
    $('.right-tip').fadeIn(600);
  } else if (winScroll <= 6740) {
    $('.right-tip').fadeOut(600);
  }

  // END
});
'use strict';

angular.module('fifty-three').controller('shopCtrl', function ($scope, shopService) {});
'use strict';

angular.module('fifty-three').service('shopService', function ($http, $q) {});
'use strict';

angular.module('fifty-three').directive('carouselDir', function () {

  return {
    restrict: 'E',
    templateUrl: './app/directives/carouselDir/carouselDir.html',
    controller: function controller($scope, carouselDirService, authService, $state, cartService) {

      $scope.crazy = 'crazy';

      $scope.getProducts = function () {
        carouselDirService.getProducts().then(function (response) {
          $scope.products = response;
          console.log(response);
          $scope.pencil = $scope.products[0];
        });
      };
      $scope.getProducts();

      $scope.getCurrentUser = function () {
        authService.getCurrentUser().then(function (response) {
          console.log('User on session?');
          console.log(response);
          $scope.currentUser = response.data;
        }).catch(function (err) {
          $scope.currentUser = null;
        });
      };
      $scope.getCurrentUser();

      $scope.gold = function () {
        $scope.pencil = $scope.products[0];
      };
      $scope.graphite = function () {
        $scope.pencil = $scope.products[1];
      };
      $scope.walnut = function () {
        $scope.pencil = $scope.products[2];
      };

      $scope.addToCart = function (pencil) {
        if (!$scope.currentUser) {
          $(function () {
            $('.dk-outer-wrapper').fadeIn(500);
            $('.dk-outer-wrapper').css({
              "display": "flex"
            });
            $('.modal-outer-wrapper').on('click', function () {
              $('.modal-outer-wrapper').fadeOut(500);
            });
          });

          return;
          // return $scope.hideModal = false;
        }
        console.log(pencil);
        authService.getUserOrder($scope.currentUser.id).then(function (user_basket) {
          console.log('user order: ');
          console.log(user_basket);
          var orderid = user_basket.data.order.id;
          authService.addToCart(orderid, pencil.product_id, 1).then(function (response) {
            console.log(response);
            // authService.getUserOrder($scope.currentUser.id)
            // .then((response) => {
            //   console.log('second get to order: ');
            //   console.log(response);
            $state.go('cart', { userid: $scope.currentUser.id });
            // })
          });
        });
      };

      $scope.login = function (user) {
        authService.login(user).then(function (response) {
          console.log(response.data);
          $scope.currentUser = response.data;
          if (!response.data) {
            alert('User cannot be found');
            $scope.user.password = '';
          } else {
            $scope.addToCart($scope.pencil);
          }
        }).catch(function (err) {
          swal({
            type: "error",
            title: "Log in failed.",
            confirmButtonText: "Ok",
            animation: "slide-from-top"
          });
        });
      };

      $scope.register = function (user) {
        authService.registerUser(user).then(function (response) {
          if (!response.data) {
            alert('unable to create user');
          } else {
            alert('user created');
            $scope.newUser = {};
          }
        }).catch(function (err) {
          alert('unable to create user');
        });
      };

      // $scope.hideModal = true;
      //===JQUERY==================================
      $(function () {
        $('.gold').on('click', function () {
          $('.gold').removeClass('gold-h');
          $('.graphite').removeClass('selected');
          $('.walnut').removeClass('selected');
          $('.gold').addClass('selected');
          $('.graphite').addClass('graphite-h');
          $('.walnut').addClass('walnut-h');
        });
      });
      $(function () {
        $('.graphite').on('click', function () {
          $('.graphite').removeClass('graphite-h');
          $('.gold').removeClass('selected');
          $('.walnut').removeClass('selected');
          $('.graphite').addClass('selected');
          $('.gold').addClass('gold-h');
          $('.walnut').addClass('walnut-h');
        });
      });
      $(function () {
        $('.walnut').on('click', function () {
          $('.walnut').removeClass('walnut-h');
          $('.graphite').removeClass('selected');
          $('.gold').removeClass('selected');
          $('.walnut').addClass('selected');
          $('.graphite').addClass('graphite-h');
          $('.gold').addClass('gold-h');
        });
      });

      $(function () {
        $("input").change(function () {
          var inputs = $(this).closest('form').find(':input');
          inputs.eq(inputs.index(this) + 1).focus();
        });
      });

      //MODAL JQUERY
      $(function () {
        $('.dk-sign-up').on('click', function () {
          $('.dk-outer-wrapper').fadeOut(1000);
          $('.kd-outer-wrapper').fadeIn(100);
          $('.kd-outer-wrapper').css({
            "display": "flex"
          });
        });
        $('.kd-sign-in').on('click', function () {
          $('.kd-outer-wrapper').fadeOut(1000);
          $('.dk-outer-wrapper').fadeIn(100);
          $('.dk-outer-wrapper').css({
            "display": "flex"
          });
        });
      });
      //===END CONTROLLER==
    }
    //===END RETURN========
  };
  //===END=================
});
'use strict';

angular.module('fifty-three').service('carouselDirService', function ($http, $q) {

  this.getProducts = function () {
    return $http({
      method: 'GET',
      url: '/api/products'
    }).then(function (response) {
      var products = response.data;
      var gold = {
        name: products[0].prod_desc,
        price: products[0].price,
        product_id: 1,
        images: [],
        cart_img: products[3].image_path
      };
      var graphite = {
        name: products[4].prod_desc,
        price: products[4].price,
        product_id: 2,
        images: [],
        cart_img: products[7].image_path
      };
      var walnut = {
        name: products[8].prod_desc,
        price: products[8].price,
        product_id: 3,
        images: [],
        cart_img: products[12].image_path
      };
      for (var i = 0; i < products.length; i++) {
        if (i < 3) {
          gold.images.push(products[i].image_path);
        } else if (i > 3 && i < 7) {
          graphite.images.push(products[i].image_path);
        } else if (i > 7 && i < 12) {
          walnut.images.push(products[i].image_path);
        }
      }
      return [gold, graphite, walnut];
    });
  };

  //==END=====
});
'use strict';

angular.module('fifty-three').directive('footerDir', function () {
  return {
    restrict: 'AE',
    templateUrl: './app/directives/footerDir/footerDir.html',
    controller: function controller($scope) {}
  };
});
'use strict';

angular.module('fifty-three').directive('navDir', function () {
  return {
    restrict: 'E',
    templateUrl: './app/directives/navDir/navDir.html',
    controller: function controller($scope) {}
  };
});
//# sourceMappingURL=all.js.map
