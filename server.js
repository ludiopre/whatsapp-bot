const express = require('express');
const bodyParser = require('body-parser');
const { MessagingResponse } = require('twilio').twiml;
const { productos } = require('./config');
const { enviarAlerta } = require('./alerts');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Configuración de OpenAI con variable de entorno segura
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/webhook', async (req, res) => {
  const twiml = new MessagingResponse();
  const msg = req.body.Body.trim().toLowerCase();

  const menu = `Hola 👋 ¿Qué producto deseas consultar?\n1️⃣ Papel higiénico\n2️⃣ Jabón lavaloza\n3️⃣ Esponjillas multiusos`;

  try {
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
      // Respuesta con GPT si no coincide con las opciones anteriores
      const respuesta = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Eres un vendedor amable, rápido y profesional de una empresa que ofrece productos institucionales de aseo como papel higiénico, jabón lavaloza y esponjillas multiusos. Tu objetivo es responder preguntas de los clientes de forma clara, concreta y siempre intentar guiar al cierre de la compra.`
          },
          {
            role: "user",
            content: msg
          }
        ],
        max_tokens: 100,
        temperature: 0.7,
      });

      const respuestaGPT = respuesta.data.choices[0].message.content;
      twiml.message(respuestaGPT);
    }
  } catch (error) {
    console.error('❌ Error con OpenAI:', error.message);
    twiml.message('Hubo un error procesando tu mensaje. Por favor intenta más tarde o escribe "menu".');
  }

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

app.listen(3000, () => {
  console.log('🤖 Bot con GPT activo en el puerto 3000');
});
