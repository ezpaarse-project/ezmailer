const Boom = require('@hapi/boom');

module.exports = () => (req, res, next) => {
  if (res.boom) { return next(); }

  res.boom = {};

  Object.getOwnPropertyNames(Boom).forEach((key) => {
    if (typeof Boom[key] !== 'function') { return; }

    res.boom[key] = (...args) => {
      const boom = Boom[key](...args);
      return res.status(boom.output.statusCode).send(boom);
    };
  });

  return next();
};
