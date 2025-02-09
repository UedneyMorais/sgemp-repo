const checkPermissions = (requiredPermissions) => {
    return (req, res, next) => {
        const userPermissions = req.user && req.user.permissions;

        if (!userPermissions) {
            return res.status(403).send({ message: 'Permissões insuficientes' });
        }

        const hasPermission = requiredPermissions.every(permission =>
            userPermissions.includes(permission)
        );

        if (!hasPermission) {
            return res.status(403).send({ message: 'Acesso negado' });
        }

        next();
    };
};

module.exports = checkPermissions;


