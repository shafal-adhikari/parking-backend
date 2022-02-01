const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //If the error is trusted or occured during the operation
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  //If the error is programming error , don't leak it to the user.
  else {
    console.log("Error 🔥🔥", err);

    //send some generic message to the user.
    res.status(500).json({
      status: "error",
      message: "Opps! something went very wrong🌋",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  }
  if (process.env.NODE_ENV === "production") {
    sendErrorProd(err, res);
  }
  next();
};
