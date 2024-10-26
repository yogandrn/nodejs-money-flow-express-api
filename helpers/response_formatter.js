module.exports = function responseFormatter(
  res,
  statusCode,
  message,
  data = null
) {
  return res
    .status(statusCode)
    .json({ status_code: statusCode, message, data });
};
