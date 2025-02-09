const validate = (schema) => async (req, res, next) => {
    try {
        await schema.validate(req.body, { abortEarly: false });
        next();
    } catch (error) {
        // Check if 'inner' exists, fallback to a generic error response
        const errors = error.inner?.map((err) => ({
            path: err.path,
            message: err.message,
        })) || [{ message: error.message }];

        res.status(400).json({
            message: 'Falha na validação',
            errors,
        });
    }
};

module.exports = validate;
