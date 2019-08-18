const express = require('express');
const mongoose = require('mongoose')
const path = require('path');
const cors = require('cors');

const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server); 

mongoose.connect('mongodb+srv://semana:Rssv217@cluster0-lzyq1.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
});

// Apartir deste middleware todas a próximas a requisição com nossas rotas, arquivos teram 
// acesso a informação
app.use((req, res, next) => {
    req.io = io;

    next(); // Variavel do express que garante que isto seja executavel e as seguintes tbm.
})

// Com a dependencia cors, basicamente ele permite que a nossa aplicação backend 
// seja acessada por qualquer aplicação frontend/mobile mesmo estando em dominios diferentes.
app.use(cors());

// Toda vez que for acessado a pasta /files vou automaticamente acessar a pasta resized.
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads', 'resized')));

app.use(require('./routes'));

app.listen(3333);