angular.module('fifty-three')
.controller('cartCtrl', ($scope, cartService, $stateParams, authService, $timeout, $state, stripe, $http, $interval) => {

$scope.something = cartService.something;

const fetchCart = () => {
  authService.getUserOrder($stateParams.userid)
  .then((response) => {
    // console.log('second get to order: ');
    // console.log(response);
    $scope.userCart = response.data;
    const allProducts = $scope.userCart.products;
    var subtotal = 0;
    for (var i = 0; i < allProducts.length; i++) {
      subtotal += (allProducts[i].qty * allProducts[i].price);
      $scope.schmotal = subtotal;
    }
  })
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
$scope.addQty = (item_id, item_qty) => {
  const adding = item_qty + 1;
  // console.log('item qty to update: ')
  // console.log(adding);
  cartService.updateQty(item_id, adding).then((response) => {
  fetchCart();
  });
}

$scope.subtractQty = (item_id, item_qty) => {
  const subtracting = item_qty - 1;
  if (subtracting <= 0) {
      swal({
        title: "Remove item?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Remove",
        cancelButtonText: "Keep",
        animation: "slide-from-top"
      },
      () => {
      cartService.removeItem(item_id).then((response) => {
        fetchCart();
      });
      }

    );
  } else {
    // console.log('item subtract');
    // console.log(subtracting);
    cartService.updateQty(item_id, subtracting);
    fetchCart();
  }
};

$scope.placeOrder = (user_id, order_id) => {
  cartService.placeOrder(user_id, order_id).then((response) => {
    $state.go('shop');
  })
}

//==========STRIPE==================
  $scope.passValues = (userId, orderId, schmotal) => {
    $scope.stripeUserId = userId;
    $scope.stripeOrderId = orderId;
    $scope.stripeTotal = schmotal;
  }


  $scope.payment = {};
  $scope.payment.amount = 23;

  $scope.charge = function () {
    return stripe.card.createToken($scope.payment.card)
    .then(function (response) {
      console.log('token created for card ending in ', response.card.last4);
      var payment = angular.copy($scope.payment);
      payment.card = void 0;
      payment.token = response.id;
      console.log("schmotal from controller: ");
      console.log($scope.stripeTotal);
      // return $http.post('/api/payment', payment);
      return $http({
        method: 'POST',
        url: '/api/payment',
        data: {
          amount: $scope.stripeTotal,
          payment: payment
        }
      })
    })
    .then(function(payment) {
      console.log('successfully submitted payment for $', payment);
      swal({
        title: "Thank You!",
        text: "Your order will be shipped within 3 business days.",
        imageUrl: "https://cdn.shopify.com/s/files/1/0245/8513/t/7/assets/53-dark.svg?1246397996584665470",
        timer: 4000,
        showConfirmButton: false
      })
      cartService.placeOrder($scope.stripeUserId, $scope.stripeOrderId).then((response) => {
        $state.go('pencil');
      })
    })
    .catch(function (err) {
       if (err.type && /^Stripe/.test(err.type)) {
         console.log('Stripe error: ', err.message);
       }
       else {
         console.log('Other error occurred, possibly with your API', err.message);
       }
     });
 };


$scope.makeCust = (firstName, lastName, street, apt, city, state, zip) => {
  $scope.cust = {
    firstName: firstName,
    lastName: lastName,
    street: street,
    apt: apt,
    city: city,
    state: state,
    zip: zip
  };
}


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

$(() => {
  //checkout button
  $('.checkout-btn').on('click', () => {
    $('.slide-in-review').css({
      "width": "400px"
    });
  //review slide in
    $('.slide-in-fade').fadeIn();
    $('.bub1').css({
      "background": '#EB5E28'
    })
    $('.text1').delay(500).fadeIn(2000);
  })

  $('.edit').on('click', () => {
    $('.slide-in-review').css({
      "width": "0px"
    });
    $('.slide-in-fade').fadeOut();
    $('.bub1').css({
      "background": '#FFFCF5'
    });
    $('.text1').fadeOut(1000);
  })

  $('.proceed').on('click', ()=> {
    $('.slide-in-info').css({
      "width": "400px"
    })
  })

  $('.slide-in-fade').on('click', () => {
    $('.slide-in-review, .slide-in-info, .slide-in-confirm').css({
      "width": "0px"
    });
    $('.slide-in-fade').fadeOut();
    $('.bub1').css({
      "background": '#FFFCF5'
    });
    $('.text1').fadeOut(1000);
  })

  $('.proceed').on('click', ()=> {
    $('.slide-in-info').css({
      "width": "400px"
    });
    $('.bub22').css({
      'background': '#EB5E28'
    });
    $('.text22').delay(500).fadeIn(2000);
  })
//info slide in
  $('.sq').on('click', () => {
    $('.slide-in-info').css({
      'width': "400px"
    })
  })
  $('.back').on('click', ()=> {
    $('.slide-in-info').css({
      "width": "0px"
    });
    $('.text22').fadeOut(1000);
    $('.bub22').css({
      "background": "#FFFCF5"
    })
  })
  $('.confirm').on('click', ()=> {
    $('.slide-in-confirm').css({
      "width": "400px"
    })
    $('.bub333').css({
      "background": "#EB5E28"
    });
    $('.text333').delay(500).fadeIn(2000);
  })
//confirm slide in

  $('.sq2').on('click', ()=> {
    $('.slide-in-confirm').css({
      "width": "400px"
    })
  })



})




 //===END CTRL=======
})
