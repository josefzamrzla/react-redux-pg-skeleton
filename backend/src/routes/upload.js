import express from 'express';

export default (app, routeHandler, authCheckMiddleware) => {
  const router = express.Router();

  router.use('*', authCheckMiddleware);

  router.post('/', routeHandler(async (req, res, next) => {
    next(req.files);
  }));

  return router;
};
