export default (userRepository, UnauthorizedError, routeHandler) => routeHandler(async (req, res, next) => {
  if (!(req.jwt && req.jwt.sub)) {
    throw new UnauthorizedError();
  }

  const user = await userRepository.getById(req.jwt.sub);
  if (user === null) {
    throw new UnauthorizedError();
  }

  req.user = user;
  return next();
});
