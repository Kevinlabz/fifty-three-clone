//===REQUIRE=============================
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const massive = require('massive');
const stripeKey = require('./stripeSecretKeys');

const stripe = require('stripe')(stripeKey.secretKey);

const secret = require('./secret');
//===INITIALIZE EXPRESS APP===================
const app = module.exports = express();


//===MIDDLEWARE===========================
app.use(bodyParser.json());
app.use(express.static(__dirname + './../public'));
// app.use(cors());

//===CONNECT TO POSTGRESS SERVER===========
const massiveServer = massive.connectSync({
  connectionString: 'postgress://localhost/53-auth-cart'
});
app.set('db', massiveServer);
const db = app.get('db');

//===REQUIRE CONTROLLERS(BELOW APP.SET)========
const productsCtrl = require('./productsCtrl');
const userCtrl = require('./userCtrl');
const orderCtrl = require('./orderCtrl');
//===REQUIRE PASSPORT==================
const passport = require('./passport');

//===POLICIES===========================
const isAuthed = (req,res,next) => {
  if (!req.isAuthenticated()) return res.status(401).send();
  return next();
};

//===SESSION AND PASSPORT=====================
app.use(session({
	secret: secret.secret,
	saveUninitialized: false,
	resave: false
}));
app.use(passport.initialize());
app.use(passport.session());

//===PASSPORT ENDPOINTS===================
app.post('/login', passport.authenticate('local', {
  successRedirect: '/me'
}))
app.get('/logout', (req,res, next) => {
  req.logout();
  return res.status(200).send('logged out');
});

//===USER ENDPOINTS=========================
///left off here monday nov 7th 12:29PM
app.post('/register', userCtrl.register);
// app.get('/user', productsCtrl.read);
app.get('/me', isAuthed, userCtrl.me);
// app.put('/user/:_id', isAuthed, productsCtrl.update);

//===ORDER ENDPOINTS======================
app.post('/api/order:userid', orderCtrl.createOrder);
app.put('/api/order/complete/:orderid/:userid', orderCtrl.completeOrder, orderCtrl.createOrder);
app.get('/api/order/:userid', orderCtrl.getUserOrder);
app.get('/api/order/completed/:userid', orderCtrl.getUserHistory);

//===PRODUCTS IN CART ENDPOINT============
app.get('/api/products', productsCtrl.getProducts);
app.get('/api/in/cart/:cartid', productsCtrl.getInCart);
app.post('/api/add/item/cart/:cartid', productsCtrl.addToCart);
app.put('/api/update/qty/:itemid/:qty', productsCtrl.updateProductInCart);
app.delete('/api/delete/item/cart/:itemid', productsCtrl.deleteCartItem);



// ===ENDPOINTS for orig db============================
// app.get('/api/products', productsCtrl.getProducts);
// app.get('/api/cart', productsCtrl.getCart);


//STRIPE ENDPOINTS
// app.post('/charge', (req, res) => {
//
//   var stripeToken = req.body.payment;
//   console.log('here is the stripe token: ');
//   console.log(stripeToken);
//   const amount = req.body.amount;
//   //convert amount to pennies
//   const chargeAmt = amount;
//   const amountArray = chargeAmt.toString().split('');
//   for (var i = 0; i < amountArray.length; i++) {
//   	if(amountArray[i] === ".") {
//   		amountArray.splice(i, 1);
//   	}
//   }
//   const pennies = parseInt(amountArray.join(''));
//
//
//   stripe.charges.create({
//     currency: 'usd',
//     source: {
//       number: '4242424242424242',
//       cvc: '111',
//       exp_month: 12,
//       exp_year:2017
//     },
//     amount: pennies
//   },
//   function(err, charge) {
//     if (err) {
//       res.status(500).send( err);
//     } else {
//       res.status(204).send();
//     }
//   });
// });


// payment
app.post('/api/payment', function(req, res, next){
  console.log(req.body);

  //convert amount to pennies
  var chargeAmt = req.body.amount;
  var amountArray = chargeAmt.toString().split('');
  var pennies = [];
  for (var i = 0; i < amountArray.length; i++) {
    if(amountArray[i] === ".") {
      if (typeof amountArray[i + 1] === "string") {
        pennies.push(amountArray[i + 1]);
      } else {
        pennies.push("0");
      }
      if (typeof amountArray[i + 2] === "string") {
        pennies.push(amountArray[i + 2]);
      } else {
        pennies.push("0");
      }
    	break;
    } else {
    	pennies.push(amountArray[i])
    }
  }
  const convertedAmt = parseInt(pennies.join(''));
  console.log("Pennies: ");
  console.log(convertedAmt);

  var charge = stripe.charges.create({
  amount: convertedAmt, // amount in cents, again
  currency: 'usd',
  source: req.body.payment.token,
  description: 'Test charge for FiftyThree.com'
}, function(err, charge) {
     res.sendStatus(200);
  // if (err && err.type === 'StripeCardError') {
  //   // The card has been declined
  // }
});
});


//===PORT====================================
const port = 80;
app.listen(port, () => {
  console.log('Listening on port: ' + port);
})
