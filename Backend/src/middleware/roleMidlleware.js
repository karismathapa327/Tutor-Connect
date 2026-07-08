// middleware/roleMiddleware.js

const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user's role is allowed
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access Denied. You do not have permission.",
      });
    }

    next();
  };
};

module.exports = authorize;