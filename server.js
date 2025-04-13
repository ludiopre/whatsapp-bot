const express = require('express');
const bodyParser = require('body-parser');
const { MessagingResponse } = require('twilio').twiml;
const { productos } = require('./config');
const { enviarAlerta } = require('./alerts');
const OpenAI = require('openai'); // OpenAI v4.x

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
      // GPT responde como vendedor
      const respuesta = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Eres un vendedor profesional, amable y claro que trabaja para una empresa de productos institucionales de aseo. Tu trabajo es resolver dudas, presentar productos y motivar la compra de papel higiénico, jabón lavaloza y esponjillas multiusos. Sé directo y útil.`
          },
          {
            role: "user",
            content: msg
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      });

      const respuestaGPT = respuesta.choices[0].message.content;
      twiml.message(respuestaGPT);
    }
  } catch (error) {
    console.error('❌ Error con GPT:', error.message);
    twiml.message('Ocurrió un error al procesar tu solicitud. Escribe "menu" para ver las opciones disponibles.');
  }

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

app.listen(3000, () => {
  console.log('🤖 Bot con GPT activo en el puerto 3000');
});

