module.exports = (err, req, res, next) => {
    // Loga o erro no console para depuração
    console.error(err.stack);

    // Envia uma resposta com o erro
    res.status(err.status || 500).json({
        message: err.message || 'Ocorreu um erro no servidor',
        details: err.details || []
    });
};
