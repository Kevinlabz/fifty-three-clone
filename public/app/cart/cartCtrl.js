angular.module('fifty-three')
.controller('cartCtrl', ($scope, cartService, $stateParams, authService, $timeout, $state) => {

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
})
