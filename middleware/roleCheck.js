const roleCheck = (roles) => {
    return (req, res, next) => {
        if (roles.includes(req.user?.role || req.admin?.role)) {
            next();
        } else {
            return res.status(403).json({
                success: false,
                message: "Access denied. Insufficient permissions."
            });
        }
    };
};

module.exports = { roleCheck };