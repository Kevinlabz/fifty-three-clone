angular.module('fifty-three')
.directive('carouselDir', () => {

  return {
    restrict: 'E',
    templateUrl: './app/directives/carouselDir/carouselDir.html',
    controller: ($scope, carouselDirService, authService, $state) => {

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
          return $scope.hideModal = false;
        }
        console.log(pencil);
        //logic here
        $state.go('cart');
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
          alert('Unable to login');
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


      $scope.hideModal = true;
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


    //===END CONTROLLER==
    }
  //===END RETURN========
  }
//===END=================
})
