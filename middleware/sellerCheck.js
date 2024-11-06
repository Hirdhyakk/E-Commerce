const sellerCheck = (req, res, next) => {
    if (req.user && req.user.isSeller) {
        next();
    } else {
        res.status(403).send('Access Denied: Sellers only');
    }
};

module.exports = sellerCheck;
