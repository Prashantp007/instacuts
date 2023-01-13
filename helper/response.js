module.exports = {
  successResponse: (res, msg) => {
    return res.status(200).json({
      status: 200,
      message: msg,
    });
  },
  failedResponse: (res, msg) => {
    return res.status(400).json({
      status: 400,
      massage: msg,
    });
  },
  successResponseStatus: (res, sts, msg) => {
    return res.status(sts).json({
      status: sts,
      message: msg,
    });
  },
  failedResponseStatus: (res, sts, msg) => {
    return res.status(sts).json({
      status: sts,
      massage: msg,
    });
  },
};
