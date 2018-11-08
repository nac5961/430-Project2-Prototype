// Import custom files
const controllers = require('./controllers');
const mid = require('./middleware');

// Setup routing for requests
const router = (app) => {
  // GET
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.homePage);

  app.get('/display', mid.requiresSecure, mid.requiresLogin, controllers.Payment.displayPage);
  app.get('/create', mid.requiresSecure, mid.requiresLogin, controllers.Payment.creationPage);

  app.get('/logout', mid.requiresSecure, mid.requiresLogin, controllers.Account.logout);

  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getPayments', mid.requiresSecure, mid.requiresLogin,
			controllers.Payment.getAllPayments);

  // POST
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.post('/createPayment', mid.requiresSecure, mid.requiresLogin, controllers.Payment.create);

  // DELETE
  app.delete('/remove', mid.requiresSecure, mid.requiresLogin, controllers.Payment.remove);

  // UPDATE
  app.put('/updatePayment', mid.requiresSecure, mid.requiresLogin, controllers.Payment.update);
};

module.exports = router;
