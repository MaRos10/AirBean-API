// Middleware to be used in routes to check if user is admin

/* const adminAuth = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    // If user is logged in and admin
    next();
  } else {
    // If user isn´t logged in or admin, send error-message
    res.status(403).json({
      success: false,
      message: "You do not have the required permissions.",
      status: 403,
    });
  }
}; */

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
