const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  return res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
    data: null,
  });
};

module.exports = errorHandler;