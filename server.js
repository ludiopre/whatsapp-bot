const express = require('express');
const bodyParser = require('body-parser');
const webhook = require('./routes/webhook');
const compras = require('./routes/compras');
const alertas = require('./routes/alertas');

const app = express();
app.use(bodyParser.json());

app.use('/comerciantes', comerciantes);
app.use('/productos', productos);
app.use('/webhook', webhook);
app.use('/comprar', compras);
app.use('/alertas', alertas);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AutoBot API activa en puerto ${PORT}`));
