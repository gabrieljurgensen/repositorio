// Importa as dependências
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger.json'); // ou o arquivo yaml, ou o objeto json
app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// Rota inicial
app.get('/', (req, res) => {
    res.send('API rodando com sucesso!');
});


// Importa rotas externas
app.use('/users', require('./routes/users'));
app.use('/produto', require('./routes/produto'));
app.use('/categoria', require('./routes/categoria'));
app.use('/estoque', require('./routes/estoque'));
app.use('/fornecedores', require('./routes/fornecedores'));
app.use('/vendas', require('./routes/vendas'));
app.use('/compras', require('./routes/compras'));
app.use('/itens_compra', require('./routes/itens_compra'));
app.use('/itens_venda', require('./routes/itens_venda'));
app.use('/login', require('./routes/login'));

// Inicia o servidor
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;