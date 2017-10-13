import express from 'express';

export default (app, routeHandler, authCheckMiddleware, withUserMiddleware) => {
  const router = express.Router();

  router.use('*', authCheckMiddleware);

  router.get('/', withUserMiddleware, routeHandler(async (req, res, next) => {
    next({ bulk: [], user: req.user });
  }));

  return router;
};
