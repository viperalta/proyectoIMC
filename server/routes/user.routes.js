// inside of user.routes.js
const UserController = require('../controllers/user.controller');
const ImcController = require('../controllers/imc.controller');
const authenticate = require('../config/authenticate');

module.exports = function(app) {
  app.post("/api/register", UserController.Register);
  app.post("/api/login", UserController.Login);
  app.post("/api/logout", UserController.Logout);
  // this route now has to be authenticated
  app.get("/api/users", authenticate, UserController.getAll);
  app.get('/api/user/:id', authenticate, UserController.getUser);

  app.post('/api/imc/new', ImcController.createImc);
  app.put('/api/imc/pull', ImcController.pullImc);
}
