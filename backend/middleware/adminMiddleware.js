module.exports = function (req, res, next) {
    // req.user is already set by the authMiddleware (from Day 3)
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
};