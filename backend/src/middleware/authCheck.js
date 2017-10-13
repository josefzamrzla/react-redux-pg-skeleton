import jwt from 'jsonwebtoken';

export default (config, UnauthorizedError, routeHandler) => routeHandler((req, res, next) => {
  if (!(req.headers.authorization || req.query.token)) {
    return next(new UnauthorizedError());
  }

  // get the last part from a authorization header string like "bearer token-value"
  const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : req.query.token;

  // decode the token using a secret key-phrase
  return jwt.verify(token, config.jwtSecret, (err, decoded) => {
    // the 401 code is for unauthorized status
    if (err) {
      return next(new UnauthorizedError());
    }

    req.jwt = decoded;
    console.log('Auth decoded', decoded); // eslint-disable-line
    return next(); // auth succeeded
  });
});
