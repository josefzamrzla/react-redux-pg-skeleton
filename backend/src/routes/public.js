import express from 'express';
import jwt from 'jsonwebtoken';

export default (db, config, routeHandler, UnauthorizedError, userRepository) => {
  const router = express.Router();

  router.get('/ping', routeHandler(async (req, res, next) => {
    next({ status: 'ok', at: new Date() });
  }));

  router.post('/login', routeHandler(async (req, res, next) => {
    if (!(req.data.username && req.data.password)) {
      next(new UnauthorizedError('Invalid username or password'));
      return;
    }

    const user = await userRepository.getById();
    if (user === null) {
      throw new UnauthorizedError('Invalid username or password');
    }

    const payload = {
      sub: user.id
    };

    // create a token string
    const token = jwt.sign(payload, config.jwtSecret); // , { expiresIn: 60 });
    next({
      success: true,
      token,
      user: { username: user.username, displayName: user.displayName }
    });
  }));

  return router;
};
