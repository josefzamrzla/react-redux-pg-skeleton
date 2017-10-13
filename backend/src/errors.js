export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized.') {
    super(message);
    Error.captureStackTrace && Error.captureStackTrace(this, UnauthorizedError);
    this.httpCode = 401;
  }
}

export class BadRequestError extends Error {
  constructor(message = 'Bad request.') {
    super(message);
    Error.captureStackTrace && Error.captureStackTrace(this, BadRequestError);
    this.httpCode = 400;
  }
}

export class NotAllowedError extends Error {
  constructor(message = 'You are not allowed to perform this action.') {
    super(message);
    Error.captureStackTrace && Error.captureStackTrace(this, NotAllowedError);
    this.httpCode = 403;
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Not found.') {
    super(message);
    Error.captureStackTrace && Error.captureStackTrace(this, NotFoundError);
    this.httpCode = 404;
  }
}

export class ConflictError extends Error {
  constructor(message = 'Conflict.') {
    super(message);
    Error.captureStackTrace && Error.captureStackTrace(this, ConflictError);
    this.httpCode = 409;
  }
}
