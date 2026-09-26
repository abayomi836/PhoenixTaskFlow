const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
      data: null,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
    data: null,
  });
};

module.exports = errorHandler;