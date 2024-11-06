const adminCheck = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).send('Access Denied: Admins only');
    }
};

module.exports = adminCheck;
