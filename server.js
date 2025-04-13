const express = require('express');
const bodyParser = require('body-parser');
const { MessagingResponse } = require('twilio').twiml;
const { productos } = require('./config');
const { enviarAlerta } = require('./alerts');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/webhook', (req, res) => {
  const twiml = new MessagingResponse();
  const msg = req.body.Body.trim().toLowerCase();

  const menu = `Hola 👋 ¿Qué producto deseas consultar?\n1️⃣ Papel higiénico\n2️⃣ Jabón lavaloza\n3️⃣ Esponjillas multiusos`;

  if (msg === 'hola' || msg === 'menu') {
    twiml.message(menu);
  } else if (msg === '1') {
    twiml.message(productos.papel);
  } else if (msg === '2') {
    twiml.message(productos.jabon);
  } else if (msg === '3') {
    twiml.message(productos.esponja);
  } else if (msg === 'comprar') {
    twiml.message('¡Gracias por tu interés! Un asesor se pondrá en contacto contigo pronto.');
    enviarAlerta(req.body.From, req.body.Body);
  } else {
    twiml.message('Por favor escribe "menu" para ver las opciones disponibles.');
  }

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

app.listen(3000, () => {
  console.log('Bot activo en el puerto 3000');
});
