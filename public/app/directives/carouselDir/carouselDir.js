angular.module('fifty-three')
.directive('carouselDir', () => {

  return {
    restrict: 'E',
    templateUrl: './app/directives/carouselDir/carouselDir.html',
    controller: ($scope, carouselDirService, authService, $state, cartService) => {

      $scope.crazy = 'crazy';

      $scope.getProducts = () => {
        carouselDirService.getProducts().then((response) => {
          $scope.products = response;
          console.log(response);
          $scope.pencil = $scope.products[0];
        })
      }
      $scope.getProducts();

      $scope.getCurrentUser = () => {
        authService.getCurrentUser().then((response) => {
          console.log('User on session?');
          console.log(response);
          $scope.currentUser = response.data;
        }).catch((err) => {
          $scope.currentUser = null;
        })
      }
      $scope.getCurrentUser();

      $scope.gold = () => {
        $scope.pencil = $scope.products[0];
      } ;
      $scope.graphite = () => {
        $scope.pencil = $scope.products[1];
      };
      $scope.walnut = () => {
        $scope.pencil = $scope.products[2];
      };

      $scope.addToCart = (pencil) => {
        if (!$scope.currentUser) {

          $(() => {
            $('.sign-in-bg').fadeIn(500);
            $('.sign-in-outer-wrap').css({
              "left": "40%"
            })
          })



          // $(() => {
          //   $('.dk-outer-wrapper').fadeIn(500);
          //   $('.dk-outer-wrapper').css({
          //     "display": "flex"
          //   });
          //   $('.modal-outer-wrapper').on('click', () => {
          //     $('.modal-outer-wrapper').fadeOut(500);
          //   })
          // })

          return;
          // return $scope.hideModal = false;
        }
        console.log(pencil);
        authService.getUserOrder($scope.currentUser.id)
        .then((user_basket) => {
          console.log('user order: ')
          console.log(user_basket);
          const orderid = user_basket.data.order.id;
          authService.addToCart(orderid, pencil.product_id, 1)
          .then((response) => {
            console.log(response)
            // authService.getUserOrder($scope.currentUser.id)
            // .then((response) => {
            //   console.log('second get to order: ');
            //   console.log(response);
              $state.go('cart', {userid: $scope.currentUser.id});
            // })
          })
        })
      };

      $scope.login = (user) => {
        authService.login(user).then((response) => {
          console.log(response.data);
          $scope.currentUser = response.data;
          if (!response.data) {
            alert('User cannot be found');
            $scope.user.password = '';
          } else {
            $scope.addToCart($scope.pencil);
          }
        }).catch((err) => {
          swal({
            type: "error",
            title: "Log in failed.",
            confirmButtonText: "Ok",
            animation: "slide-from-top"
          })
        })
      }

      $scope.register = (user) => {
        authService.registerUser(user).then((response) => {
          if (!response.data) {
            alert('unable to create user');
          } else {
            alert('user created');
            $scope.newUser = {};
          }
        }).catch((err) => {
          alert('unable to create user');
        });
      };


      // $scope.hideModal = true;
      //===JQUERY==================================
      $(() =>  {
        $('.gold').on('click', () => {
          $('.gold').removeClass('gold-h');
          $('.graphite').removeClass('selected');
          $('.walnut').removeClass('selected');
          $('.gold').addClass('selected');
          $('.graphite').addClass('graphite-h');
          $('.walnut').addClass('walnut-h')
          })
        });
      $(() =>  {
        $('.graphite').on('click', () => {
          $('.graphite').removeClass('graphite-h');
          $('.gold').removeClass('selected');
          $('.walnut').removeClass('selected');
          $('.graphite').addClass('selected');
          $('.gold').addClass('gold-h');
          $('.walnut').addClass('walnut-h')
          })
        });
      $(() =>  {
        $('.walnut').on('click', () => {
          $('.walnut').removeClass('walnut-h');
          $('.graphite').removeClass('selected');
          $('.gold').removeClass('selected');
          $('.walnut').addClass('selected');
          $('.graphite').addClass('graphite-h');
          $('.gold').addClass('gold-h')
          })
        });

        $(() => {
          $("input").change(function() {
            var inputs = $(this).closest('form').find(':input');
            inputs.eq( inputs.index(this)+ 1 ).focus();
          });
        })


        //MODAL JQUERY
        $(() => {
          $('.dk-sign-up').on('click', () => {
            $('.dk-outer-wrapper').fadeOut(1000);
            $('.kd-outer-wrapper').fadeIn(100);
            $('.kd-outer-wrapper').css({
              "display": "flex"
            });
          });
          $('.kd-sign-in').on('click', () => {
            $('.kd-outer-wrapper').fadeOut(1000);
            $('.dk-outer-wrapper').fadeIn(100);
            $('.dk-outer-wrapper').css({
              "display": "flex"
            });
          })
        })

        //updated modal
        $(() => {
          $('.sign-in-bg').on('click', ()=> {
            $('.sign-in-bg').fadeOut(500);
            $('.sign-in-outer-wrap').css({
              "left": "-450px"
            });
            $('.sign-up-outer-wrap').css({
              "right": "-450px"
            })
          })
          $('.sign-up').on('click', ()=> {
            $('.sign-in-outer-wrap').css({
              "left": "-450px"
            });
            $('.sign-up-outer-wrap').css({
              "right": "40%"
            })
          })
          $('.return').on('click', ()=> {
            $('.sign-up-outer-wrap').css({
              "right": "-450px"
            });
            $('.sign-in-outer-wrap').css({
              "left": "40%"
            })
          })




        })
    //===END CONTROLLER==
    }
  //===END RETURN========
  }
//===END=================
})
