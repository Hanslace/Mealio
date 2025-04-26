module.exports = function(allowedRoles = []) {
    return (req, res, next) => {
      // req.user should be set by authMiddleware
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      // check if user role is in the allowedRoles array
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      next();
    };
  };