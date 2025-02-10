const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { authenticateToken } = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cookieParser = require('cookie-parser');
const cors = require('cors'); 

// Rotas
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const productRoute = require('./routes/product');
const categoryRoute = require('./routes/category');
const cityRoute = require('./routes/city');
const customerRoute = require('./routes/customer');
const saleRoute = require('./routes/sale');
const stockMovementRoute = require('./routes/stockMovement');
const paymentMethodRoute = require('./routes/paymentMethods');


/** 

const rotaEndereco = require('./routes/endereco');
const rotaCliente = require('./routes/cliente');
const rotaCidade = require('./routes/cidade');
const rotaFilial = require('./routes/filial');
*/
const app = express();

// Middleware
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: true }));

//app.use(bodyParser.json());
app.use(express.json()); 

// Middleware para servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configuração de CORS completa
const corsOptions = {
    origin: [
        'https://localhost:8081', 
        'https://192.168.77.137:8081',
        'http://localhost:8081', 
        'http://192.168.77.137:8081',
        'https://localhost:8080', 
        'https://192.168.77.137:8080',
        'http://localhost:8080', 
        'http://192.168.77.137:8080',    
    
    ], 
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Origin', 
        'X-Requested-With', 
        'Content-Type', 
        'Accept', 
        'Authorization', 
        'Key' // Adicione outros headers personalizados, se necessário
    ],
    exposedHeaders: ['refresh_token', 'access_token', 'set-cookie'],
    credentials: true, // Permitir envio de cookies e autenticação
};

// Adicionar o middleware de CORS
// Aplicar o middleware de CORS
app.use(cors(corsOptions));

// Responder a requisições OPTIONS
app.options('*', cors(corsOptions));

// // Log para depuração
// app.use((req, res, next) => {
//     console.log(`Request received: ${req.method} ${req.url}`);
//     console.log('Headers:', req.headers);
//     next();
// });



// Rotas report
const productReportRoute = require('./routes/productReport');


// Definindo as rotas
app.use('/auth', authRoute);
app.use('/user', authenticateToken, userRoute);
app.use('/product', authenticateToken, productRoute);
app.use('/category', authenticateToken, categoryRoute);
app.use('/city', authenticateToken, cityRoute);
app.use('/customer', authenticateToken, customerRoute);
app.use('/sale', authenticateToken, saleRoute);
app.use('/stock', authenticateToken, stockMovementRoute);
app.use('/payment-method', authenticateToken, paymentMethodRoute);

// Rotas report
app.use('/product-report', authenticateToken, productReportRoute);


/**
app.use('/endereco', authenticateToken, rotaEndereco);
app.use('/cliente', authenticateToken, rotaCliente)
app.use('/filial', authenticateToken, rotaFilial)
*/

// Rota principal para localhost:3000
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Configuração do Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Sgemp API',
            version: '1.0.0',
            description: 'Documentação da API do sistema Sgemp',
        },
        servers: [
            {
                url: 'http://localhost:3000', // Altere a URL conforme necessário
            },
        ],
    },
    apis: [
        process.env.NODE_ENV === 'production' 
        ? path.resolve(__dirname, './routes/*.js') 
        : './src/routes/*.js'
    ],
};

// Inicializa a documentação do Swagger
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Rota para acessar a documentação do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Tratamento de erros para rotas não encontradas
app.use((req, res, next) => {
    const error = new Error('Endpoint não encontrado.');
    error.status = 404;
    next(error);
});

// Middleware de tratamento de erros global
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message,
        },
    });
});

// Middleware de tratamento de erros global deve ser o último
app.use(errorHandler);

// Middleware de cookies
app.use(cookieParser());

module.exports = app;
