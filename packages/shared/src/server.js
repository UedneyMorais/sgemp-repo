require('dotenv').config();
const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');
const app = require('./app');

const port = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production'; 

// Configuração do HTTPS
const httpsOptions = {
    key: fs.readFileSync(
      path.join(
        __dirname,
        isProduction ? './certs/localhost-key.pem' : '../src/certs/localhost-key.pem'
      )
    ),
    cert: fs.readFileSync(
      path.join(
        __dirname,
        isProduction ? './certs/localhost.pem' : '../src/certs/localhost.pem'
      )
    ),
  };

const server = https.createServer(httpsOptions, app);

const { startTokenCleaner} = require('./jobs/tokenCleaner');

startTokenCleaner();

server.listen(port, () => {
    console.log(`Server is running on https://localhost:${port}`);
    console.log(`Process ID (PID): ${process.pid}`); // Exibe o número do processo
});

//netstat -ano | findstr :3000
//lsof -i :3000
//netstat -ano | grep :3000
