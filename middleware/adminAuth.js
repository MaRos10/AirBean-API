// Middleware to be used in routes to check if user is admin

const adminAuth = (req, res, next) => {
  if (global.currentUser && global.currentUser.role === "admin") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "You do not have the required permissions.",
      status: 403,
    });
  }
};

export default adminAuth;
