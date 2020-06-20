const badRequest = {
  status: 400,
  message: 'The data was incorrect',
};

const unauthorized = {
  status: 401,
  message: 'Not authorized',
};

const notFound = {
  status: 404,
  message: 'Not found',
};

module.exports = {
  badRequest,
  unauthorized,
  notFound,
};
